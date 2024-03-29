import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from 'src/helper/crud-service';
import { InjectModel } from '@nestjs/sequelize';
import UserListDto from './dto/user-list.dto';
import { Op } from 'sequelize';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    public userModel: typeof User,
  ) {}
  async getProfile(id: number) {
    return await User.findOne({
      where: { id },
      attributes: ['id', 'username', 'role', 'status'],
    });
  }

  async validate(login: LoginDto): Promise<User | boolean> {
    const rs = await User.findOne({ where: { username: login.username } });
    if (rs && !rs.status) {
      throw new BadRequestException('Akun tidak aktif, tidak dapat login menggunakan akun ini!');
    }
    if (!!rs) {
      const isValid = bcrypt.compareSync(login.password, rs.credential);
      if (isValid) {
        const payload = { id: rs.id, username: rs.username };
        const token = jwt.sign(payload, process.env.SALT);
        rs.uuid = token;
        await rs.save();
        rs.credential = null;
        return rs;
      }
    }

    throw new BadRequestException('Username/Password Salah');
  }

  async validateUserLogin(login: LoginDto): Promise<User | boolean> {
    const rs = await User.findOne({ where: { username: login.username } });
    if (!!rs) {
      const isValid = bcrypt.compareSync(login.password, rs.credential);
      if (isValid) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  async registerUser(u: RegisterDto): Promise<User | string> {
    try {
      if (!u.password) {
        return 'Tolong isi password!';
      }

      if (u.password !== u.passwordRepeat) {
        return 'Password tidak sama!';
      }

      if (!u.role || !['admin', 'user'].includes(u.role)) {
        return 'Tolong isi role!';
      }

      if (!u.status) {
        return 'Tolong isi status!';
      }

      if (!u.username) {
        return 'Tolong isi username!';
      }

      // Check username on database
      if (await this.isUsernameExist(u.username)) {
        return 'Username sudah ada!';
      }

      const data: any = u;
      const user = new User(data);
      const salt = bcrypt.genSaltSync(10);
      user.credential = bcrypt.hashSync(u.password, salt);
      await user.save();
      user.setDataValue('credential', null);
      return user;
    } catch (e) {
      console.error(e);
      return e.toString();
    }
  }

  async updateStatus(id: number): Promise<User> {
    const oldData = await this.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['credential', 'uuid'] },
    });
    if (oldData) {
      oldData.status = !oldData.status;
      return oldData.save();
    }
    throw new BadRequestException('Data Not Found!');
  }

  async listData(params: UserListDto, id: number): Promise<any> {
    const where = {};
    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            id: { [Op.substring]: params.search },
          },
          {
            username: { [Op.substring]: params.search },
          },
        ],
      });
    }
    const data = await this.findAndCountAll({
      attributes: { exclude: ['credential', 'uuid'] },
      where: where,
      order: [
        ['status', 'DESC'],
        ['id', 'ASC'],
        [params.orderBy, params.orderType],
      ],
      offset: Number((params.page - 1) * params.limit),
      limit: Number(params.limit),
    });

    // EXCLUDE THE USER DATA IF THE SAME WITH USER THAT LOGGED IN
    // OR IT CAN BE REMOVED LATER
    const newData = data.rows.filter((item: any) => {
      return item.id !== id;
    });
    const page = Math.ceil(data.count / params.limit);
    return { count: Number(data.count), page: page, rows: newData };
  }

  async updateUser(params: UpdateUserDto) {
    const oldData = await this.findOne({
      where: {
        id: params.id,
      },
      attributes: { exclude: ['credential', 'uuid'] },
    });
    if (oldData) {
      for (const key in oldData) {
        if (key == 'dataValues') {
          for (const key in oldData['dataValues']) {
            if (key in params) {
              if (params[key]) {
                oldData[key] = params[key];
              }
            }
          }
          break;
        }
      }
      const rs = await oldData.save();
      return rs;
    }
    throw new BadRequestException(`Data tidak ditemukan!`);
  }

  async getByUsername(username: string): Promise<User> {
    return await User.findOne({ where: { username } });
  }

  async isUsernameExist(username: string): Promise<boolean> {
    const rs = await User.findOne({ where: { username } });
    return !!rs;
  }
  async isValidAuth(token: string, idUser: number, username: string) {
    const res = await User.findOne({
      where: { id: idUser, uuid: token, username },
    });
    return !!res;
  }

  async findAll(criteria: any): Promise<User[]> {
    return await this.userModel.findAll(criteria);
  }
  async create(params: any): Promise<User> {
    return await this.userModel.create(params);
  }
  async findOne(options: any): Promise<User> {
    return await this.userModel.findOne(options);
  }
  async findOneById(id: number): Promise<User> {
    return await this.userModel.findOne({ where: { id } });
  }
  async findAndCountAll(options: any): Promise<any> {
    return await this.userModel.findAndCountAll(options);
  }
  async update(value: any, criteria: any) {
    return await this.userModel.update(value, criteria);
  }
}
