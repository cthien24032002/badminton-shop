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
  // @UseGuards(AuthGuard('local'))
  async login(@Body() body: { phone: string; password: string }) {
    const user = await this.authService.validateUser(body);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const dataLogin = await this.authService.login(user);
    return ApiCustomResponse.success(HttpStatus.OK, dataLogin, 'Login succeed');
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('')
  // test(@Request() req) {
  //   return req.user;
  // }
}
