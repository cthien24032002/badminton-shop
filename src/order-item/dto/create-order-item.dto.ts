import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'ID of the order' })
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'ID of the product' })
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100.000, description: 'Unit price of the product' })
  unitPrice: number;
}
