import { OrderStatus, PaymentMethod } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/order-item/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID người dùng đặt hàng' })
  @IsNumber({}, { message: 'id người dùng phải là số' })
  @IsPositive({ message: 'id người dùng phải là số dương' })
  userId: number;

  @IsEnum(OrderStatus)
  @ApiProperty({
    example: OrderStatus.NEW,
    description: 'Trạng thái đơn hàng',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiProperty({ example: '182/3 Thanh Xuân Hà Nội', description: 'địa chỉ nhận hàng' })
  @IsNotEmpty({message: 'địa chỉ không được để trống'})
  @IsString({message: 'địa chỉ phải là chuỗi'})
  address: string;

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
