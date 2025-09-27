import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Badminton Racket',
    description: 'Name of the product',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: 'A high-quality badminton racket.',
    description: 'Description of the product',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 150.0, description: 'Price of the product' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 50, description: 'Stock quantity of the product' })
  @Type(() => Number)
  @IsInt()
  stock: number;

  @ApiProperty({ example: 1, description: 'Stock quantity of the product' })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: true, description: 'Is the product featured?' })
  @Type(() => Number)
  @IsInt()
  isFeatured?: number;
}
