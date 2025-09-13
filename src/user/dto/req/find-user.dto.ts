import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { slugify } from 'src/common/utils/slug.util';

export class QueryFindUser extends PaginationDto {
  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    description:
      'Tên người dùng sẽ được chuyển thành slug để tìm kiếm (ví dụ: "Nguyen Van A" → "nguyen-van-a")',
  })
  @Transform(({ value }) => slugify(value), { toClassOnly: true })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Số điện thoại người dùng',
  })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: 'nguyenvana@gmail.com',
    description: 'Email người dùng',
  })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Người dùng Active',
  })
  @IsOptional()
  isActive: boolean;
}
