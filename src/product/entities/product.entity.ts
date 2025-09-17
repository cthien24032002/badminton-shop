import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('products')
export class Product extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: false })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;
  
  @ManyToOne(() => Category, {
    eager: true,
    cascade:true
  })
  category: Category;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
