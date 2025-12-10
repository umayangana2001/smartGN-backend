import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { VillageOfficerAuthService } from './village-officer-auth.service';
import { VillageOfficerAuthController } from './village-officer-auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'smartgn-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserAuthController, VillageOfficerAuthController],
  providers: [UserAuthService, VillageOfficerAuthService, JwtStrategy],
  exports: [UserAuthService, VillageOfficerAuthService, JwtModule],
})
export class AuthModule {}
