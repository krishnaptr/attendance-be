import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CustomApiErrorResponse,
  CustomApiUnauthorizedResponse,
} from 'src/library/swagger-response';
import { AbsensiService } from './absensi.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from '../../helper/files-upload';
import { response } from '../../helper/response';
import AbsensiDto from './dto/absensi.dto';
import { Response } from 'express';
import PagingDto from '../../global-dto/paging.dto';
import ReportDto from '../../global-dto/report.dto';

@ApiTags('Absensi API')
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
@Controller('absensi')
export class AbsensiController {
  constructor(private readonly absensiService: AbsensiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('fotoPegawai'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    description: 'This endpoint used to create absen',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async absensi(
    @UploadedFile() image: Image,
    @Body() params: AbsensiDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.absensiService.absensi(params, image);
    return response(data, 'Success', HttpStatus.OK);
  }

  @Get('masuk/list')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get list absence in',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async absenceIn(@Query() params: PagingDto) {
    const data = await this.absensiService.listData(params, 'masuk');
    return response(data, 'Success', HttpStatus.OK);
  }

  @Get('masuk/report')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get report absence in',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async absenceInReport(@Query() params: ReportDto) {
    const data = await this.absensiService.listReport(params, 'masuk');
    return response(data, 'Success', HttpStatus.OK);
  }

  @Get('keluar/list')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get list absence out',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async absenceOut(@Query() params: PagingDto) {
    const data = await this.absensiService.listData(params, 'keluar');
    return response(data, 'Success', HttpStatus.OK);
  }

  @Get('keluar/report')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get report absence out',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async absenceOutReport(@Query() params: ReportDto) {
    const data = await this.absensiService.listReport(params, 'keluar');
    return response(data, 'Success', HttpStatus.OK);
  }
}
