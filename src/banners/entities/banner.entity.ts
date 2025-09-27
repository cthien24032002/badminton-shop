import { BaseEntityDto } from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('banners')
export class Banner extends BaseEntityDto {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: false })
  image: string | null;
}
