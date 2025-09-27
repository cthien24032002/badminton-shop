import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateImageProductDto {
  @ApiProperty({ example: 1, description: 'Id sản phẩm' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Không được để trống id sản phẩm' })
  @IsNumber({},{ message: 'Id phải là số' })
  @Min(0, { message: 'id phải >= 1' })
  id: number;
}
