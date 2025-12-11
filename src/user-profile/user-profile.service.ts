import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MyInfoDto } from './dto/my-info.dto';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.userProfile.findUnique({
      where: { userId },
      include: { documents: true },
    });
  }

  async createOrUpdateProfile(userId: string, data: MyInfoDto) {
    const existing = await this.prisma.userProfile.findUnique({ where: { userId } });

    if (existing) {
      return this.prisma.userProfile.update({
        where: { userId },
        data,
      });
    } else {
      return this.prisma.userProfile.create({
        data: { ...data, userId },
      });
    }
  }
}
