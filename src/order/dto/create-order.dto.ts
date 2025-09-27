import {
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  isPositive,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';



export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID người dùng đặt hàng' })
  @IsNumber({},{ message: 'id người dùng phải là số' })
  @IsPositive(({ message: 'id người dùng phải là số dương' }))
  userId: number;

  @IsEnum(OrderStatus)
  @ApiProperty({
    example: 'Mới',
    description: 'Trạng thái đơn hàng',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @IsEnum(PaymentMethod)
  @IsNotEmpty({ message: 'phương thức thanh toán không được để trống' })
  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.COD,
    description: 'Phương thức thanh toán',
  })
  paymentMethod: PaymentMethod;



  orderItems: any;

}
