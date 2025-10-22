import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { OrderStatus } from "src/common/enums";
import { Type } from 'class-transformer';

export class UpdateImageOrderDto {
    @IsNotEmpty({message: 'Id không được để trống'})
    @Type(()=>Number)
    @IsNumber({},{message:'Id phải là 1 số'})
    @ApiProperty({
        example: 1,
        description: 'Id đơn hàng',
    })
    id: number;
}