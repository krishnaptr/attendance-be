import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CustomApiErrorResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/library/swagger-response';
import { PegawaiService } from '../pegawai/pegawai.service';
import { response } from '../../helper/response';
import { UserService } from '../user/user.service';

@ApiTags('Dashboard API')
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
@Controller('dashboard')
export class DashboardController {
  constructor(private pegawaiS: PegawaiService, private userS: UserService) {}

  @Get('/total/nfc')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get total nfc',
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
  async getCountNfc() {
    const data = await this.pegawaiS.count({});
    return response(200, data, HttpStatus.OK);
  }

  @Get('/total/pegawai')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get total staff',
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
  async getCountStaff() {
    const data = await this.pegawaiS.count({});
    return response(200, data, HttpStatus.OK);
  }

  @Get('/total/user')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get total user',
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
  async getTotalUser() {
    const data = await this.userS.count({});
    return response(200, data, HttpStatus.OK);
  }
}
