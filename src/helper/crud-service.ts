import { Op } from 'sequelize';
import saveImage, { Image } from './files-upload';
import { ListDto } from 'src/global-dto/list.dto';

export class CrudService {
  constructor(
    public model: any,
    public folderName?: string,
    public isWithImage?: boolean,
    public isNotIncludeImagePath?: boolean,
  ) {}

  async list(
    param: ListDto,
    customOrder?: any,
  ): Promise<
    | {
        totalPage: number;
        pageIndex: number;
        list: any[];
      }
    | string
  > {
    try {
      const LIMIT = param.limit > 0 ? Number(param.limit) : 10;
      const cond: any = {
        offset: param.page * LIMIT,
        limit: LIMIT,
        order: [],
      };

      if (param.limit === 0) {
        delete cond.limit;
        delete cond.offset;
      }

      if (customOrder) {
        cond.order.push(customOrder);
      }
      if (!!param.orderBy) {
        cond.order.push([param.orderBy, param.orderType]);
      }

      if (!!param.conditions) {
        let where = {};
        const c = JSON.parse(param.conditions);
        for (let key in c) {
          let value = '%' + c[key] + '%';
          where[key] = {
            [Op.like]: value,
          };
        }

        cond.where = where;
      }

      const rs = await this.model.findAndCountAll(cond);
      const count = Math.ceil((await rs.count) / LIMIT);
      return {
        totalPage: count,
        pageIndex: param.page,
        list: rs.rows || [],
      };
    } catch (e) {
      console.error(e);
      return e.toString();
    }
  }

  async detail(id: number): Promise<any[] | boolean> {
    try {
      return await this.model.findOne({ where: { id } });
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async insert(body: any, file?: Image): Promise<any | string> {
    try {
      if (this.isWithImage) {
        if (!file) {
          return 'image are required!';
        }

        delete body.id;
        delete body.createdAt;
        delete body.updatedAt;

        const res = await saveImage(file, this.folderName);
        if (!res.success) {
          return res.message;
        }
        body.image = `${
          this.isNotIncludeImagePath ? '' : '/' + this.folderName + '/'
        }${res.fileName}`;
      }
      let data = {};
      return await this.model.create({ ...body }, data);
    } catch (e) {
      if (!!e.errors && !!e.errors[0]) {
        console.error(e.errors);
        return e.errors[0].message;
      }

      console.log(e);
      return e.toString();
    }
  }

  async update(body: any, file?: Image): Promise<any | string> {
    try {
      if (this.isWithImage) {
        if (file) {
          const res = await saveImage(file, this.folderName);
          if (!res.success) {
            return res.message;
          }
          body.image = `${
            this.isNotIncludeImagePath ? '' : '/' + this.folderName + '/'
          }${res.fileName}`;
        }
      }

      delete body.createdAt;
      delete body.updatedAt;

      await this.model.update(body, { where: { id: body.id } });
      const data = await this.model.findOne({ where: { id: body.id } });
      if (!data) {
        return 'resource not found';
      } else {
        return data;
      }
    } catch (e) {
      console.log(e);
      return e.toString();
    }
  }

  async delete(id: number): Promise<boolean | string> {
    try {
      const rs = await this.model.findOne({ where: { id } });
      if (!rs) {
        return 'resource not found';
      }

      await rs.destroy();
      return true;
    } catch (e) {
      console.error(e);
      return e.toString();
    }
  }
}
