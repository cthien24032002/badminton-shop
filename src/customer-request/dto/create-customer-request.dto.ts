import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerRequestDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên khách hàng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: ['image1.jpg', 'image2.png'],
    description: 'Danh sách hình ảnh (tùy chọn)',
  })
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  images?: string[];

  @ApiProperty({ example: 'TP.HCM', description: 'Dia Chi khách hàng' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại khách hàng',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Yêu cầu hỗ trợ về đơn hàng #12345',
    description: 'Mô tả chi tiết yêu cầu',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
