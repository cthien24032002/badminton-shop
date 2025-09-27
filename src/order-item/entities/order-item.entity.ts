import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import { Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntityDtoWithSlug {
  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  product: Product;

  @Column({ type: 'tinyint', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unitPrice: number; // giá hiện tại của sản phẩm

  @Column({ type: 'nvarchar', nullable: false })
  productName: string;

  @Column({ type: 'text', nullable: false })
  image: string;
}
