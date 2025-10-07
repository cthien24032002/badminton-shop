import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateCustomerRequestDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên khách hàng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại khách hàng' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Yêu cầu hỗ trợ về đơn hàng #12345', description: 'Mô tả chi tiết yêu cầu' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
