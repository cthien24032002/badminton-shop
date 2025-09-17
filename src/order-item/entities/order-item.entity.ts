import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import {Entity,Column,ManyToOne,BeforeInsert,BeforeUpdate} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntityDtoWithSlug {
  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unitPrice: number; // giá hiện tại của sản phẩm 


}
