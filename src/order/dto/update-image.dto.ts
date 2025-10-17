import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { OrderStatus } from "src/common/enums";

export class UpdateImageOrderDto {
    @IsNotEmpty({message: 'Id không được để trống'})
    @IsNumber({},{message:'Id phải là 1 số'})
    @ApiProperty({
        example: 1,
        description: 'Id đơn hàng',
    })
    id: number;
}