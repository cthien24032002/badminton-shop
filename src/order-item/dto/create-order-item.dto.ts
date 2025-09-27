import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber({} , { message: 'id đơn hàng phải là số' })
  @IsNotEmpty({ message: 'id đơn hàng không được để trống' })
  @ApiProperty({ example: 1, description: 'ID đơn hàng' })
  orderId: number;

  @IsNumber({}, { message: 'id sản phẩm phải là số' })
  @IsNotEmpty({ message: 'id sản phẩm không được để trống' })
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  productId: number;

  @IsNumber({}, { message: 'số lượng phải là số' })
  @IsNotEmpty({ message: 'số lượng không được để trống' })
  @ApiProperty({ example: 2, description: 'số lượng sản phẩm' })
  quantity: number;

  @IsNumber({}, { message: 'giá sản phẩm phải là số' })
  @IsNotEmpty({ message: 'giá sản phẩm không được để trống' })
  @ApiProperty({ example: 100.000, description: 'giá sản phẩm lúc đặt hàng' })
  unitPrice: number;

  @IsString({ message: 'tên sản phẩm phải là chuỗi' })
  @IsNotEmpty({ message: 'tên sản phẩm không được để trống' })
  @ApiProperty({ example: 'Vợt cầu lông Yonex', description: 'tên của sản phẩm lúc đặt hàng ' })
  productName: string;
}
