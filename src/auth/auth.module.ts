import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { RolesGuard } from './guards/roles.guard';


@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'smartgn-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserAuthController,SuperAdminController,],
  providers: [UserAuthService, SuperAdminService,JwtStrategy, RolesGuard,],
  exports: [UserAuthService, JwtModule],
})
export class AuthModule {}
