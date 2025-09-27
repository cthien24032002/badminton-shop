import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

// OmitType để loại bỏ field không cho update (ví dụ: createdBy, phone,...)
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['isFeatured'] as const),
) {
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsNumber({}, { message: 'ID phải là 1 số' })
  @IsNotEmpty({ message: 'ID không được rỗng' })
  @IsPositive()
  id: number;

  @ApiProperty({ example: '1', description: 'San pham hot' })
  @IsOptional()
  @IsBoolean({ message: 'Phải là boolean' })
  isFeatured?: boolean;
}
