import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Lọc gió', description: 'Tên danh mục' })
  @IsNotEmpty({ message: 'Không được để trống tên danh mục' })
  @IsString({ message: 'Tên phải là chữ' })
  name: string;

  @ApiProperty({ example: null, description: 'ID danh mục cha (null nếu là danh mục gốc)', required: false })
  @IsOptional()
  @Type(() => Number) // ép string -> number khi nhận query/body
  @IsNumber({}, { message: 'pid phải là số' })
  @Min(0, { message: 'pid phải >= 1' })
  pid?: number|null; // sẽ set null nếu không truyền
}
