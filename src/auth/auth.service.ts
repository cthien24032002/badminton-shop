import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: { phone: string; password: string }) {
    const user = await this.userService.findOnePhone(body.phone);

    if (!user) {
      throw new NotFoundException(
        `User with phone ${body.phone} not found in app`,
      );
    }

    if (await comparePassword(body.password, user.password)) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Password is wrong');
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, ...user };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

}
