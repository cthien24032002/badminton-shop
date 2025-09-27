import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @ApiProperty({ description: 'ID banner', example: 1 })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsNumber({}, { message: 'Id phải là 1 số' })
  @Min(1, { message: 'Id phải lớn hơn 0' })
  id: number;
}
