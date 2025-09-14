import { Entity,Column,OneToMany,CreateDateColumn,UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length:100})
    fullname: string;
    @Column({length:11, unique:true})
    phone: string;
    
}