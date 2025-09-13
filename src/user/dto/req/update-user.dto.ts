import { CreateUserDto } from './create-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto),["password","phone"]) {}
