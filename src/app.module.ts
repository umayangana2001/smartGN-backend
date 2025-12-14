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

/**
 * Root application module
 * 
 * Configures global JWT authentication guard - all endpoints are protected by default.
 * Use @Public() decorator on endpoints that should be publicly accessible.
 */
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
    // Global JWT authentication guard - protects all endpoints by default
    // Endpoints can opt-out using @Public() decorator
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

