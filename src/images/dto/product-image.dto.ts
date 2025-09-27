import { Expose } from "class-transformer";

export class ProductImageDto {
      @Expose()
      id: number;
    
      @Expose()
      imageUrl: string;
}