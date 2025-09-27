import { Expose, Type } from 'class-transformer';
import { BaseDtoWithSlug } from 'src/common/dto/base.dto';

export class CategoryDto extends BaseDtoWithSlug {
  @Expose()
  name: string;

  @Expose()
  @Type(() => CategoryDto)
  pid?: CategoryDto | null;
  
  @Expose()
  image: string;

  @Expose()
  @Type(() => CategoryDto)
  children?: CategoryDto[];
}
