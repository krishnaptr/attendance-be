import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  Request,
  RequestMapping,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Response } from 'express';
import { response, responseForbidden, responseOk } from 'src/helper/response';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CustomApiErrorResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/library/swagger-response';
import { UserGuard } from './user.guard';
import UserListDto from './dto/user-list.dto';
@ApiTags('User API')
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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to get current session user profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  async profile(@Res({ passthrough: true }) res: Response) {
    const result = await this.userService.getProfile(res.locals.tokenData.id);
    return response(200, result, 'ok');
  }

  @Put('/update')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: CustomApiNotFoundResponse(),
  })
  async updateUserData(@Body() body: UpdateUserDto) {
    const result = await this.userService.updateUser(body);
    return response(result, 'Success', HttpStatus.OK);
  }

  @Patch('/status/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to update status user',
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
  async patchStatusUser(@Param('id') id: number) {
    const data = await this.userService.updateStatus(id);
    return response(200, data, HttpStatus.OK);
  }

  @Get('/list')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'This endpoint used to list user',
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
  async getUserList(
    @Query() params: UserListDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.listData(params, res.locals.tokenData.id);
    return response(200, data, HttpStatus.OK);
  }
}
