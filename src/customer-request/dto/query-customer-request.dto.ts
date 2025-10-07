import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum,IsOptional,} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CustomerRequestStatus } from 'src/common/enums';


export class QueryFindRequest extends PaginationDto {

  @ApiPropertyOptional({
    example: '0703918803',
    description: 'số điện thoại hoac ten',
  })
  @Type(()=>String)
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    example: CustomerRequestStatus.NEW,
    description: 'Trạng thái order',
  })
  @IsOptional()
  @IsEnum(CustomerRequestStatus, { message: 'Giá trị trạng thái không hợp lệ' })
  requestStatus?: CustomerRequestStatus;
}
