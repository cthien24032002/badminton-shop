import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { OrderStatus, PaymentMethod } from 'src/common/enums';

@Entity('orders')
export class Order extends BaseEntityDtoWithSlug {
  @ManyToOne(() => User, { nullable: true})
  user: User | null;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  // @Column({ type: 'enum', enum: PaymentMethod })
  // paymentMethod: PaymentMethod;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
  })
  orderItems: OrderItem[];
}
