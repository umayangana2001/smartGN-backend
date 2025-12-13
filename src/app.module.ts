import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile/user-profile.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ServiceRequestModule } from './service-request/service-request.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    UserProfileModule,
    FileUploadModule,
    AuthModule,
    ServiceRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

