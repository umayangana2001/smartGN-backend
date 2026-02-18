import { Module } from '@nestjs/common';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
   imports: [PrismaModule, NotificationModule],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
