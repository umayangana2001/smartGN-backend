import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.requests)
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => User, user => user.assigned_requests)
  gn: User;

  @Column()
  gn_id: number;

  @Column({ type: 'date' })
  request_date: Date;

  @Column()
  request_type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'declined', 'completed'],
    default: 'pending'
  })
  status: string;

  @Column({ type: 'date', nullable: true })
  verification_date: Date;

  @Column({ nullable: true })
  certificate_url: string;

  @CreateDateColumn()
  created_at: Date;
}