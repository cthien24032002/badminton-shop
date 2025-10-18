import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PublicUserDto extends PickType(UserDto, [
  'id',
  'name',
  'slug',
  'email',
  'phone',
  'createdAt',
  'address',
  'isActive',
  'point'
]) {}
