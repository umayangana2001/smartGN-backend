import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RequestStatus } from './request-status.enum';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'gn_id' })
  gnId: number;

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column({ name: 'request_type' })
  requestType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING
  })
  status: RequestStatus;

  @Column({ name: 'verification_date', nullable: true })
  verificationDate: Date;

  @Column({ name: 'certificate_url', nullable: true })
  certificateUrl: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  
  @ManyToOne('User', 'requests')  
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('User', 'gnRequests')
  @JoinColumn({ name: 'gn_id' })
  gnOfficer: any;
  
}