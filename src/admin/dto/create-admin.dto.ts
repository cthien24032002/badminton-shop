import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';


export class CreateAdminDto {
  @ApiProperty({
    description: 'Tên của admin',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Số điện thoại của admin',
    example: '0987654321',
  })
  @IsString()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiProperty({
    description: 'Vai trò của admin (vd: superadmin, manager, staff)',
    example: 'superadmin',
  })
  @Transform(({ value }) => value?.toUpperCase())
  @IsString()
  @IsNotEmpty({ message: 'Role không được để trống' })
  role: string;

  @ApiProperty({
    description: 'Địa chỉ email của admin',
    example: 'admin@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của admin (tối thiểu 6 ký tự)',
    example: 'StrongPass123!',
  })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
