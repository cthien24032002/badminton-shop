import { IsEnum, isNotEmpty, IsNotEmpty, IsNumber, isPositive, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from 'src/common/enums'; 
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID ' })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' }) 
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 100.000, description: 'Unit price of the product' })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsEnum(OrderStatus)
  @ApiProperty({ example: 'NEW', description: 'Status of the order', enum: OrderStatus })
  status: OrderStatus;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
   @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.COD,
    description: 'Phương thức thanh toán',
  })
  paymentMethod: PaymentMethod;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
