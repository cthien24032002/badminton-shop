import { OrderStatus, PaymentMethod } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/order-item/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID người dùng đặt hàng' })
  @IsOptional()
  @IsNumber({}, { message: 'id người dùng phải là số' })
  userId: number | null =null;

  @ApiProperty({ example: '182/3 Thanh Xuân Hà Nội', description: 'địa chỉ nhận hàng' })
  @IsNotEmpty({message: 'địa chỉ không được để trống'})
  @IsString({message: 'địa chỉ phải là chuỗi'})
  address: string;

  @ApiProperty({ example: '182/3 Thanh Xuân Hà Nội', description: 'địa chỉ nhận hàng' })
  @IsNotEmpty({message: 'địa chỉ không được để trống'})
  @IsString({message: 'name phải là chuỗi'})
  name: string;

  @ApiProperty({ example: '182/3 Thanh Xuân Hà Nội', description: 'địa chỉ nhận hàng' })
  @IsNotEmpty({message: 'địa chỉ không được để trống'})
  @IsString({message: 'phone phải là chuỗi'})
  phone: string;

  // @IsEnum(PaymentMethod)
  // @IsNotEmpty({ message: 'phương thức thanh toán không được để trống' })
  // @ApiProperty({
  //   enum: PaymentMethod,
  //   example: PaymentMethod.COD,
  //   description: 'Phương thức thanh toán',
  // })
  // paymentMethod: PaymentMethod;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
