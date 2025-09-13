import { Expose } from 'class-transformer';

export abstract class BaseDtoCustom {
  @Expose()
  id: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}

export class BaseDtoWithSlug extends BaseDtoCustom {
  @Expose()
  slug: string;
}

export class BaseDto extends BaseDtoCustom {}
