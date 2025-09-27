import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class QueryAllProductDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm sản phẩm',
    example: 'Áo thể thao',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục sản phẩm',
    example: 1,
  })
  @Type(()=>Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
