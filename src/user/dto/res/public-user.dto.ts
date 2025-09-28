import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '../user.dto';

export class PublicUserDto extends PickType(UserDto, [
  'id',
  'name',
  'slug',
  'email',
  'phone',
  'createdAt',
  'address',
  'isActive'
]) {}
