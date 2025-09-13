import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '../utils/pagination.util';

export interface PaginationServiceType<T> {
  dataResult: T;
  pagination: PaginationMeta;
};

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Số trang muốn truy cập',
    default: DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = DEFAULT_PAGE;

  @ApiProperty({
    example: 10,
    description: 'Số item muốn lấy trong 1 trang',
    default: DEFAULT_PAGE_SIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number = DEFAULT_PAGE_SIZE;
}
