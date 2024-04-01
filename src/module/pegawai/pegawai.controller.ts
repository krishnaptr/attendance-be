import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { response } from 'src/helper/response';
import {
  CustomApiErrorResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/library/swagger-response';
import PegawaiListDto from './dto/pegawai-list.dto';
import { PegawaiService } from './pegawai.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import PegawaiAddDto from './dto/pegawai-add.dto';
import { Image } from 'src/helper/files-upload';
import PegawaiEditDto from './dto/pegawai-edit.dto';
import ReportDto from '../../global-dto/report.dto';
import { concatColumn } from '../../library/utils';

@ApiTags('Pegawai API')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request Response',
  type: CustomApiErrorResponse(HttpStatus.BAD_REQUEST),
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
  type: CustomApiUnauthorizedResponse(),
})
@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('fotoPegawai'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    description: 'This endpoint used to create pegawai',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async addPegawai(
    @UploadedFile() image: Image,
    @Body() params: PegawaiAddDto,
  ) {
    const data = await this.pegawaiService.addPegawai(params, image);

    return response(data, 'Success', HttpStatus.OK);
  }

  @Put('/update')
  @UseInterceptors(FileInterceptor('fotoPegawai'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    description: 'This endpoint used to update pegawai',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async editPegawai(
    @UploadedFile() image: Image,
    @Body() params: PegawaiEditDto,
  ) {
    console.log(params);
    const data = await this.pegawaiService.editPegawai(params, image);

    return response(data, 'Success', HttpStatus.OK);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to update status pegawai',
  })
  async updateStatus(@Param('id') id: number) {
    const data = await this.pegawaiService.updateStatus(id);
    return response(data, 'Success', HttpStatus.OK);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to delete pegawai',
  })
  async deletePegawai(@Param('id') id: number) {
    const data = await this.pegawaiService.deletePegawai(id);
    console.log(data, 'DATA');
    return response(data, 'Success', HttpStatus.OK);
  }

  @Get('/list')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to list pegawai',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: CustomApiNotFoundResponse(),
  })
  async getUserList(@Query() params: PegawaiListDto) {
    const data = await this.pegawaiService.listData(params);
    return response(200, data, HttpStatus.OK);
  }

  @Get('/report')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get report pegawai',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: CustomApiNotFoundResponse(),
  })
  async getReportPegawai(@Query() params: ReportDto) {
    const data = await this.pegawaiService.reportPegawai(params);
    return response(200, data, HttpStatus.OK);
  }

  @Get('/detail/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get detail pegawai',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: CustomApiNotFoundResponse(),
  })
  async getDetailPegawai(@Param('id') id: number) {
    const data = await this.pegawaiService.findOne({
      attributes: {
        include: [
          concatColumn(
            'fotoPegawai',
            `'${this.pegawaiService.getPublicFile()}',fotoPegawai`,
          ),
        ],
        exclude: ['fotoPegawai', 'credential', 'uuid'],
      },
      where: { id },
    });
    if (!data) {
      throw new BadRequestException(`Pegawai tidak ditemukan!`);
    }
    return response(200, data, HttpStatus.OK);
  }
}
