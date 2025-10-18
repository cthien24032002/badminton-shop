import { Expose, Type } from 'class-transformer';
import { BaseDtoWithSlug } from 'src/common/dto/base.dto';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { ProductImageDto } from 'src/images/dto/product-image.dto';

export class ProductDto extends BaseDtoWithSlug {
  @Expose()
  name: string;

  @Expose()
  unit: string;

  @Expose()
  stock: number;

  @Expose()
  price: number;

  @Expose()
  salePrice: number;

  @Expose()
  isFeatured: boolean;

  @Expose()
  motorcycleBrand: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  // @Expose()
  // @Type(() => AdminDto)
  // createdBy: AdminDto;

  @Expose()
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  // @Expose()
  // @Type(() => ProducPricetDto)
  // prices: ProducPricetDto[];

  // @Expose()
  // @Type(() => AdminDto)
  // updatedBy: AdminDto;
}
