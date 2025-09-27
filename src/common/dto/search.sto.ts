import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchDto {
  @ApiProperty({
    example: "asf",
    description: 'Thông tin muốn search (tuỳ loại api)',
  })
  @IsOptional()
  search?: any ;

  
}