import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class NumberIdDto {
  @ApiProperty({ example: 1, description: 'ID của đối tượng, phải là số dương' })
  @IsNotEmpty({ message: 'Id không được để trống' })
  @Type(() => Number)
  @IsPositive()
  id: number;
}
