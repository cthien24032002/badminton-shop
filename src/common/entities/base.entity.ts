import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

abstract class BaseEntityCustom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export class BaseEntityDtoWithSlug extends BaseEntityCustom {
  @Column({ nullable: false })
  slug: string;
}

export class BaseEntityDto extends BaseEntityCustom {}
