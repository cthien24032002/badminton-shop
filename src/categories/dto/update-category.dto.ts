import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDto {
  @ApiProperty({ example: 1, description: 'Id danh mục' })
  @IsNotEmpty({ message: 'Không được để trống id' })
  @IsNumber({}, { message: 'Id phải là số' })
  id: number;

  @ApiProperty({ example: 'Lọc gió', description: 'Tên danh mục' })
  @IsOptional({ message: 'Không được để trống tên danh mục' })
  @IsString({ message: 'Tên phải là chữ' })
  name?: string;

  @ApiProperty({
    example: null,
    description: 'ID danh mục cha (null nếu là danh mục gốc)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number) // ép string -> number khi nhận query/body
  @IsNumber({}, { message: 'pid phải là số' })
  @Min(0, { message: 'pid phải >= 1' })
  pid: number | null; // sẽ set null nếu không truyền
}
