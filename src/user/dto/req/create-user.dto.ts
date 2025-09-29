// src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người dùng'})
  @IsNotEmpty({message:'Tên không được rỗng'})
  @IsString({message:'Tên phải là chữ'})
  name: string;

  @ApiProperty({ example: '0703918803', description: 'Số điện thoại người dùng'})
  @IsNotEmpty({message:'Số điện thoại không được rỗng'})
  @IsPhoneNumber('VN',{message:'Sai định dạng số điện thoại (VN)'})
  phone: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Tên người dùng'})
  @IsOptional()
  @IsEmail({},{message:'Sai định dạng email'})
  email?: string;

}
