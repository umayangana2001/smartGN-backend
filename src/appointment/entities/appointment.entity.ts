import { AppointmentStatus, AppointmentType } from '@prisma/client';

export class Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  appointmentType: AppointmentType;
  userId: string;
  officerId?: string;
  serviceRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}