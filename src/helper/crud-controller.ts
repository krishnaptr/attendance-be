import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { ListDto } from 'src/global-dto/list.dto';
import {
  response404,
  responseBad,
  responseOk,
  responseOk2,
  Result,
} from './response';

let Dto: any;
let Model: any;

export class CrudController {
  constructor(public data: any, public model: any) {
    Dto = data;
    Model = model;
  }

  @Get('/list')
  @ApiTags('CRUD: List')
  @ApiResponse({
    status: 200,
    description: 'List all the records.',
    schema: {
      properties: {
        totalPage: { type: 'number', example: 100 },
        pageIndex: { type: 'number', example: 0 },
        list: { type: 'array', example: [] },
      },
    },
  })
  async list(@Query() param: ListDto): Promise<Result> {
    try {
      const LIMIT = 50;
      const count = Math.ceil((await this.model.count()) / LIMIT);
      const cond: any = {
        offset: param.page * LIMIT,
        limit: LIMIT,
        order: [],
      };

      if (!!param.orderBy) {
        cond.order.push([param.orderBy, param.orderType]);
      }

      if (!!param.conditions) {
        const where = {};
        const c = JSON.parse(param.conditions);
        for (const key in c) {
          const value = '%' + c[key] + '%';
          where[key] = {
            [Op.like]: value,
          };
        }

        cond.where = where;
      }

      const rs = await this.model.findAll(cond);
      return responseOk({
        totalPage: count,
        pageIndex: param.page,
        list: rs || [],
      });
    } catch (e) {
      console.error(e);
      return responseBad(e.toString());
    }
  }

  @Post('/insert')
  @ApiTags('CRUD: Insert')
  @ApiBody({
    type: () => {
      return Dto;
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Insert new record',
    type: () => {
      return Model;
    },
  })
  async insert(@Body() body): Promise<Result> {
    try {
      const rs = await this.model.create(body);
      return responseOk2(rs);
    } catch (e) {
      console.error(e);
      return responseBad(e.toString());
    }
  }

  @Put('/update')
  @ApiTags('CRUD: Update')
  @ApiBody({
    type: () => {
      return Dto;
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update existing record',
    type: () => {
      return Model;
    },
  })
  async update(@Body() body: any): Promise<Result> {
    try {
      await this.model.update(body, { where: { id: body.id } });
      return responseOk2(body);
    } catch (e) {
      console.error(e);
      return responseBad(e.toString());
    }
  }

  @Delete('/delete/:id')
  @ApiTags('CRUD: Delete')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Delete existing record',
    schema: {
      properties: {
        status: { type: 'boolean' },
      },
    },
  })
  async delete(@Param('id') id): Promise<Result> {
    try {
      const rs = await this.model.findOne({ where: { id } });
      if (!rs) {
        return response404();
      }

      await rs.destroy();
      return responseOk2({ status: true });
    } catch (e) {
      console.error(e);
      return responseBad(e.toString());
    }
  }
}
