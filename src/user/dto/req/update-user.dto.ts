import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'phone',
]) {
  
}
