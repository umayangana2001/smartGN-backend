import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MyInfoDto } from './dto/my-info.dto';

/**
 * User Profile Service
 * 
 * Manages user profile information including personal details and documents.
 */
@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user profile by user ID
   * 
   * @param userId - User ID
   * @returns User profile with associated documents
   * @throws NotFoundException if profile does not exist
   */
  async getUserProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { documents: true },
    });

    if (!profile) {
      throw new NotFoundException(`User profile not found for user ID: ${userId}`);
    }

    return profile;
  }

  /**
   * Create or update user profile
   * 
   * If profile exists, updates it. Otherwise, creates a new profile.
   * Validates that the user exists before creating/updating profile.
   * 
   * @param userId - User ID
   * @param data - Profile data
   * @returns Created or updated profile
   * @throws BadRequestException if user does not exist
   */
  async createOrUpdateProfile(userId: string, data: MyInfoDto) {
    // Validate user exists to prevent foreign key violations
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const existing = await this.prisma.userProfile.findUnique({ where: { userId } });

    // Convert birthday string to Date object for Prisma
    const profileData = {
      ...data,
      birthday: new Date(data.birthday),
    };

    if (existing) {
      return this.prisma.userProfile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      return this.prisma.userProfile.create({
        data: { ...profileData, userId },
      });
    }
  }
  async getAllUsersWithProfiles() {
  return this.prisma.user.findMany({
    include: {
      profile: true,
    },
  });
}
}

