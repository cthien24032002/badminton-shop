import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsString, IsInt } from 'class-validator';

export class CreateProductDto {

@IsNotEmpty()
@IsString()
@ApiProperty({ example: 'Badminton Racket', description: 'Name of the product' })
name: string;

@IsOptional()
@ApiProperty({ example: 'A high-quality badminton racket.', description: 'Description of the product'})
@IsOptional()
@IsString()
description: string;

@ApiProperty({ example: 150.00, description: 'Price of the product' })
@IsNotEmpty()
@IsNumber()
price: number;

@ApiProperty({ example: 50, description: 'Stock quantity of the product' })
@IsInt()
stock: number;

@ApiProperty({ example: 1, description: 'Stock quantity of the product' })
@IsInt()
categoryId: number;

@ApiProperty({ example: true, description: 'Is the product featured?' })
@IsBoolean()
@IsOptional()
isFeatured?: boolean;
}