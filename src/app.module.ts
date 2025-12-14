import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserProfileModule } from './user-profile/user-profile.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ServiceRequestModule } from './service-request/service-request.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    UserProfileModule,
    FileUploadModule,
    AuthModule,
    ServiceRequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

