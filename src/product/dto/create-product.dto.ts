import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
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

  @IsOptional()
  @ApiProperty({ example: 120.0, description: 'giá giảm của sản phẩm ' })
  @Type(() => Number)
  @IsNumber({}, { message: 'giá giảm phải là số' })
  salePrice?: number;

  @ApiProperty({ example: 50, description: 'Stock quantity of the product' })
  @Type(() => Number)
  @IsInt()
  stock: number;

  @ApiProperty({ example: 1, description: 'Stock quantity of the product' })
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: true, description: 'San pham hot' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({},{ message: 'isFeatured Phải là một số' })
  isFeatured?: number;

}
