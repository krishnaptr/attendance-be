import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { responseBad, responseOk } from 'src/helper/response';
import { RegisterDto } from '../user/dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private sAuth: AuthService, private sUser: UserService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const data = await this.sUser.validate(body);
    if (!!data) {
      return responseOk(data);
    } else {
      return responseBad('Wrong username/password!');
    }
  }
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
