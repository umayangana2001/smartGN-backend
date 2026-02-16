import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MyInfoDto } from './dto/my-info.dto';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  // ✅ GET USER PROFILE
  async getUserProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        province: true,
        district: true,
        division: true,
        documents: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  // ✅ CREATE OR UPDATE PROFILE
  async createOrUpdateProfile(userId: string, data: MyInfoDto) {
    // 🔎 Check user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // 🔎 Validate province exists
    const province = await this.prisma.province.findUnique({
      where: { id: data.provinceId },
    });

    if (!province) {
      throw new BadRequestException('Invalid province');
    }

    // 🔎 Validate district exists
    const district = await this.prisma.district.findUnique({
      where: { id: data.districtId },
    });

    if (!district) {
      throw new BadRequestException('Invalid district');
    }

    // 🔎 Validate division exists
    const division = await this.prisma.division.findUnique({
      where: { id: data.divisionId },
    });

    if (!division) {
      throw new BadRequestException('Invalid division');
    }

    const existing = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const profileData = {
      fullName: data.fullName,
      address: data.address,
      nic: data.nic,
      email: data.email,
      telephone: data.telephone,
      birthday: new Date(data.birthday),

      provinceId: data.provinceId,
      districtId: data.districtId,
      divisionId: data.divisionId,
    };

    if (existing) {
      return this.prisma.userProfile.update({
        where: { userId },
        data: profileData,
        include: {
          province: true,
          district: true,
          division: true,
        },
      });
    }

    return this.prisma.userProfile.create({
      data: {
        userId,
        ...profileData,
      },
      include: {
        province: true,
        district: true,
        division: true,
      },
    });
  }

  // ✅ ADMIN: GET ALL USERS WITH PROFILES
  async getAllUsersWithProfiles() {
    return this.prisma.user.findMany({
      include: {
        profile: {
          include: {
            province: true,
            district: true,
            division: true,
          },
        },
      },
    });
  }
}

