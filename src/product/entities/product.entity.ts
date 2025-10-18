import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductImage } from 'src/images/entities/product-image.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Entity('products')
export class Product extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;
  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @ManyToOne(() => Category, (category) => category.products,{
    nullable: true,
    eager: true,
    cascade: ['insert', 'update'], // chỉ cascade khi thêm/sửa, không khi xóa
    onDelete: 'SET NULL', // <-- QUAN TRỌNG
  })
  category: Category | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null })
  salePrice: number | null; // Giá sau khi áp dụng giảm giá




  // @ManyToOne(() => Admin, { nullable: false, eager: true })
  // @JoinColumn({ name: 'createdBy' })
  // createdBy: Admin;

  // @ManyToOne(() => Admin, { nullable: true, eager: true })
  // @JoinColumn({ name: 'updatedBy' })
  // updatedBy: Admin;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
  
}
