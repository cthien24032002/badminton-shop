import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class QueryAllAdminDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Lọc theo vai trò của admin (SUPERADMIN, MANAGER, STAFF)',
    example: 'manager',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  role?: string;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm theo tên hoặc email admin',
    example: 'nguyen',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
