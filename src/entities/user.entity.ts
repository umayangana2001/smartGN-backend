
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserType } from './user-type.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  nic: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  
  @Column({
    name: 'user_type',  
    type: 'enum',
    enum: UserType,
    default: UserType.CITIZEN
  })
  userType: UserType;  

  @Column({ default: 'password123' })
  password: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  
}