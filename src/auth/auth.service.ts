import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/common/utils/password.util';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string) {
    const user = await this.userService.findOnePhone(phone);

    if (!user) {
      throw new NotFoundException(
        `Người dùng với số điện thoại ${phone} không tồn tại`,
      );
    }

    return user;
  }

  async validateAdmin(body: { phone: string; password: string }) {
    const admin = await this.adminService.findOnePhone(body.phone);
    if (!admin) {
      throw new NotFoundException(
        `Người dùng với số điện thoại ${body.phone} không tồn tại`,
      );
    }
    if(!comparePassword(body.password, admin.password)){
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
    const {password,...rest} = admin;

    return rest;
  }

  async login(user: any) {

    const payload = { sub: user.id, ...user };
    
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
