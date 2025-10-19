import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { Order } from 'src/order/entities/order.entity';
@Entity('users')
export class User extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  avatar: string | null;

  @Column({ default: 0, nullable: false })
  point: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
