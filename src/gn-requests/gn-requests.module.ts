import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GnRequestsController } from './gn-requests.controller';
import { GnRequestsService } from './gn-requests.service';
import { Request } from '../entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [GnRequestsController],
  providers: [GnRequestsService],
  exports: [GnRequestsService],
})
export class GnRequestsModule {}