import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerRequestStatus } from '../../common/enums';

export class UpdateCustomerRequestStatusDto {
  @ApiProperty({
    enum: CustomerRequestStatus,
    example: CustomerRequestStatus.NEW,
    description: 'Trạng thái yêu cầu',
  })
  @IsEnum(CustomerRequestStatus)
  @IsNotEmpty({ message: 'Trạng thái yêu cầu không được để trống' })
  requestStatus: CustomerRequestStatus;
}
