import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { responseBad, responseOk } from 'src/helper/response';
import { RegisterDto } from '../user/dto/register.dto';
import {
  CustomApiErrorResponse,
  CustomApiUnauthorizedResponse,
} from 'src/library/swagger-response';

@ApiTags('Authentication')
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
@Controller('auth')
export class AuthController {
  constructor(private sAuth: AuthService, private sUser: UserService) {}

  @ApiOperation({
    description: 'This endpoint used to login',
  })
  @Post('/login')
  async login(@Body() body: LoginDto) {
    const data = await this.sUser.validate(body);
    if (!!data) {
      return responseOk(data);
    } else {
      return responseBad('Wrong username/password!');
    }
  }

  @ApiOperation({
    description: 'This endpoint used to check admin credentials',
  })
  @Post('/validate')
  async validate(@Body() body: LoginDto) {
    const data = await this.sUser.validateUserLogin(body);
    return Object.assign({
      valid: data,
    });
  }

  @ApiOperation({
    description: 'This endpoint used to register user',
  })
  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const data = await this.sUser.registerUser(body);
    if (typeof data !== 'string') {
      return responseOk(data);
    } else {
      return responseBad(data);
    }
  }
}
