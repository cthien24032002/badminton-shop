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
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: CreateUserDto) {
    let user = await this.userService.findOnePhone(dto.phone);

    if (!user) {
      user = await this.userService.create(dto)
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
