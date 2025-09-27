import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ description: 'Tiêu đề banner', example: 'Tiêu đề banner' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chữ' })
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả banner', example: 'Mô tả banner' })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chữ' })
  description?: string ;

  @ApiPropertyOptional({
    description: 'Trạng thái hiển thị banner',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true') return true;
      if (lowerValue === 'false') return false;
      // Nếu giá trị không phải "true" hoặc "false", ném lỗi hoặc trả về undefined
      throw new Error('isActive phải là "true" hoặc "false"');
    }
    return value; // Giữ nguyên nếu đã là boolean
  })
  @IsBoolean({ message: 'Phải là boolean' })
  isActive?: boolean;
}
