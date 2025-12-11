
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GnUsersController } from './gn-users.controller';
import { GnUsersService } from './gn-users.service';
import { User } from '../entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
  ],
  controllers: [GnUsersController],
  providers: [GnUsersService],
  exports: [GnUsersService],
})
export class GnUsersModule {}