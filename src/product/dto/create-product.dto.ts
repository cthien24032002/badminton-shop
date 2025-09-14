import { IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
@IsNotEmpty()
name: string;
@IsOptional()
description: string;
@IsNumber()
price: number;
@IsNumber()
stock: number;
@IsBoolean()
@IsOptional()
isFeatured?: boolean;
}