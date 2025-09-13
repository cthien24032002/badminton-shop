import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UUIDDto {
  @ApiProperty({ example: 1, description: 'ID của đối tượng, phải 1 uuid' })
  @IsNotEmpty({ message: 'Id không được để trống' })
  id: string;
}
