import { BaseEntityDto } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminRole extends BaseEntityDto {
  @Column({ nullable: false })
  name: string;
}
