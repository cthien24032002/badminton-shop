import { BaseEntityDtoWithSlug } from 'src/common/entities/base.entity';
import { slugify } from 'src/common/utils/slug.util';
import { Product } from 'src/product/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('categories')
export class Category extends BaseEntityDtoWithSlug {
  @Column({ nullable: false })
  name: string;

  // quan hệ: nhiều con -> 1 cha
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pid' })
  pid: Category | null ;

  @OneToMany(() => Category, (category) => category.pid)
  children: Category[];

  @Column({type:"text", nullable: true })
  image: string | null;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
