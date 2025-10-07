import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { CustomerRequestStatus } from 'src/common/enums';
import { slugify } from 'src/common/utils/slug.util';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('customer_request')
export class CustomerRequest extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CustomerRequestStatus, default: CustomerRequestStatus.NEW })
  requestStatus: CustomerRequestStatus;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
