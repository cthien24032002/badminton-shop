import { Expose } from 'class-transformer';
import { BaseDtoWithSlug } from 'src/common/dto/base.dto';

export class UserDto extends BaseDtoWithSlug {
  @Expose()
  name: string;
  @Expose()
  phone: string;
  @Expose()
  email: string;
  @Expose()
  address: string;
  @Expose()
  point: number;
}
