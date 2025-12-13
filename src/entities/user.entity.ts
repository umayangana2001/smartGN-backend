import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Request } from './request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  nic: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ 
    type: 'enum', 
    enum: ['citizen', 'gn', 'admin'],
    default: 'citizen'
  })
  user_type: string;

  @Column({ default: 'password123' })
  password: string;

  @OneToMany(() => Request, request => request.user)
  requests: Request[];

  @OneToMany(() => Request, request => request.gn)
  assigned_requests: Request[];

  @CreateDateColumn()
  created_at: Date;
}