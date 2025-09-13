import { BaseEntityDto } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Admin extends BaseEntityDto {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  role: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;
}
