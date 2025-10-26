import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Trạng thái kích hoạt của admin',
    example: true,
  })
  @IsBoolean({ message: 'isActive phải là kiểu boolean (true hoặc false)' })
  isActive: boolean;
}
