import { BadRequestException, Injectable } from '@nestjs/common';
import PegawaiListDto from './dto/pegawai-list.dto';
import { Op } from 'sequelize';
import { Pegawai } from './pegawai.model';
import { InjectModel } from '@nestjs/sequelize';
import PegawaiAddDto from './dto/pegawai-add.dto';
import {
  concatColumn,
  generateFileName,
  uploadImage,
  validationImage,
} from 'src/library/utils';
import PegawaiEditDto from './dto/pegawai-edit.dto';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectModel(Pegawai)
    public pegawaiModel: typeof Pegawai,
  ) {}
  private readonly locationFile = `assets/pegawai/`;
  private readonly publicFile = `${process.env.IMAGE_PUBLIC_URL}${this.locationFile}`;
  getLocationFile(): string {
    return this.locationFile;
  }
  getPublicFile(): string {
    return this.publicFile;
  }

  async listData(params: PegawaiListDto): Promise<any> {
    const where = {};
    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            id: { [Op.substring]: params.search },
          },
          {
            Pegawainame: { [Op.substring]: params.search },
          },
        ],
      });
    }
    const data = await this.findAndCountAll({
      attributes: {
        include: [
          concatColumn('fotoPegawai', `'${this.getPublicFile()}',fotoPegawai`),
        ],
        exclude: ['fotoPegawai', 'credential', 'uuid'],
      },

      where: where,
      order: [
        ['status', 'DESC'],
        ['id', 'ASC'],
        [params.orderBy, params.orderType],
      ],
      offset: Number((params.page - 1) * params.limit),
      limit: Number(params.limit),
    });
    const page = Math.ceil(data.count / params.limit);
    return { count: Number(data.count), pages: page, rows: data.rows };
  }

  async addPegawai(params: PegawaiAddDto, imageData: any): Promise<any> {
    const check = await this.findOne({ where: { idKartu: params.idKartu } });
    if (!check) {
      const imagePegawai = generateFileName(imageData.originalname);
      await validationImage(imageData);
      const rs = await this.create({
        ...params,
        fotoPegawai: imagePegawai,
      });
      if (rs) {
        await uploadImage(
          imagePegawai,
          imageData.buffer,
          this.getLocationFile(),
        );
      }
      return rs;
    }
    throw new BadRequestException(`Pegawai sudah ada!`);
  }

  async editPegawai(params: PegawaiEditDto, fotoPegawai: any): Promise<any> {
    const oldData = await this.findOne({
      where: {
        id: params.id,
      },
    });
    if (oldData) {
      let fileName = '';
      if (fotoPegawai) {
        fileName = generateFileName(fotoPegawai.originalname);
        await validationImage(fotoPegawai);
        Object.assign(params, { fotoPegawai: fileName });
      }
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
      if (rs && fotoPegawai) {
        await uploadImage(fileName, fotoPegawai.buffer, this.getLocationFile());
      }
      return rs;
    }
    throw new BadRequestException(`Data tidak ditemukan!`);
  }

  async updateStatus(id: number): Promise<any> {
    const oldData = await this.findOne({
      where: {
        id,
      },
    });
    if (oldData) {
      oldData.status = !oldData.status;

      return oldData.save();
    }
    throw new BadRequestException('Data tidak ditemukan!');
  }

  async deletePegawai(id: number): Promise<boolean | string> {
    const rs = await this.findOne({ where: { id } });
    if (rs) {
      await rs.destroy();
      return true;
    } else {
      throw new BadRequestException('Data tidak ditemukan!');
    }
  }

  async findAll(criteria: any): Promise<Pegawai[]> {
    return await this.pegawaiModel.findAll(criteria);
  }
  async create(params: any): Promise<Pegawai> {
    return await this.pegawaiModel.create(params);
  }
  async findOne(options: any): Promise<Pegawai> {
    return await this.pegawaiModel.findOne(options);
  }
  async findOneById(id: number): Promise<Pegawai> {
    return await this.pegawaiModel.findOne({ where: { id } });
  }
  async findOneByNoPegawai(noPegawai: number): Promise<Pegawai> {
    return await this.pegawaiModel.findOne({ where: { noPegawai } });
  }
  async findAndCountAll(options: any): Promise<any> {
    return await this.pegawaiModel.findAndCountAll(options);
  }
  async update(value: any, criteria: any) {
    return await this.pegawaiModel.update(value, criteria);
  }
}
