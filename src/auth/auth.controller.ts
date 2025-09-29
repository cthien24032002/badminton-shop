import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() phone: string) {
    const user = await this.authService.validateUser(phone);

    const dataLogin = await this.authService.login(user);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataLogin,
      'Đăng nhập thành công',
    );
  }

  @Post('/admin/login')
  async loginAdmin(@Body() body: { phone: string; password: string }) {
    const admin = await this.authService.validateAdmin(body);

    const dataLogin = await this.authService.login(admin);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataLogin,
      'Đăng nhập thành công',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  test(@Request() req) {
    return req.user;
  }
}
