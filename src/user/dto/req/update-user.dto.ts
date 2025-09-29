import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'phone',
]) {
  @ApiProperty({ example: 'Ha Noi', description: 'Dia chi người dùng' })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chữ' })
  address?: string | null;
}
