import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "src/common/enums";

export class UpdateStatusOrderDto {
    @IsNotEmpty({message: 'trạng thái không được để trống'})
    @IsEnum(OrderStatus)
    @ApiProperty({
        example: OrderStatus.NEW,
        description: 'Trạng thái đơn hàng',
        enum: OrderStatus,
    })
    status: OrderStatus;
}