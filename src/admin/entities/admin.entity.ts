import {
  BaseEntityDto,
  BaseEntityDtoWithSlug,
} from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity()
export class Admin extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  role: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
