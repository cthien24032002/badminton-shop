import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPhoneNumber, IsPositive } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderStatus } from 'src/common/enums';


export class QueryFindOrder extends PaginationDto {

  @ApiPropertyOptional({
    example: '0703918803',
    description: 'số điện thoại hoac id',
  })
  @Type(()=>String)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    example: OrderStatus.NEW,
    description: 'Trạng thái order',
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Giá trị trạng thái không hợp lệ' })
  orderStatus?: OrderStatus;
}
