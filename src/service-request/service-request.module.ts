import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServiceRequestService],
  controllers: [ServiceRequestController],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}

