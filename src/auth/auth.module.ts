// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UserModule } from 'src/user/user.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from 'src/common/constants/jwt';
// import { JwtStrategy } from 'src/common/auth/local.strategy';

// @Module({
//   imports: [
//     UserModule,
//     PassportModule,
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '60d' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService,JwtStrategy],
// })
// export class AuthModule {}
