import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {

  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @Type(()=>Number)
  @IsNotEmpty({ message: 'id sản phẩm không được để trống' })
  @IsNumber({}, { message: 'id sản phẩm phải là số' })
  productId: number;

  @ApiProperty({ example: 2, description: 'số lượng sản phẩm' })
  @Type(()=>Number)
  @IsNumber({}, { message: 'số lượng phải là số' })
  @IsNotEmpty({ message: 'số lượng không được để trống' })
  quantity: number;

  @ApiProperty({ example: 100.000, description: 'giá sản phẩm lúc đặt hàng' })
  @Type(()=>Number)
  @IsNotEmpty({ message: 'giá sản phẩm không được để trống' })
  @IsNumber({}, { message: 'giá sản phẩm phải là số' })
  unitPrice: number;

  @ApiProperty({ example: 'Vợt cầu lông Yonex', description: 'tên của sản phẩm lúc đặt hàng ' })
  @IsNotEmpty({ message: 'tên sản phẩm không được để trống' })
  @IsString({ message: 'tên sản phẩm phải là chuỗi' })
  productName: string;

  @ApiProperty({ example: 'https://image.com', description: 'hình ảnh của sản phẩm lúc đặt hàng ' })
  @IsNotEmpty({ message: 'hình ảnh sản phẩm không được để trống' })
  @IsString({ message: 'hình ảnh sản phẩm phải là chuỗi' })
  image: string;
}