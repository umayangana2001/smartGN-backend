import { Controller, Get, Post, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { MyInfoDto } from './dto/my-info.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { CurrentUser } from '../auth/decorators';
import { Role } from '../auth/enums';

@ApiTags('user-profile')
@Controller('user-profile')
@ApiBearerAuth('JWT-auth')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by userId (Users can only access their own, Admins can access any)' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only access your own profile unless you are an admin' })
  getProfile(@Param('userId') userId: string, @CurrentUser() user: any) {
    // Users can only access their own profile, admins can access any
    if (user.role !== Role.ADMIN && user.id !== userId) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.userProfileService.getUserProfile(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create or update user profile (Users can only update their own, Admins can update any)' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiBody({ type: MyInfoDto })
  @ApiResponse({
    status: 200,
    description: 'User profile created or updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update your own profile unless you are an admin' })
  saveProfile(@Param('userId') userId: string, @Body() body: MyInfoDto, @CurrentUser() user: any) {
    // Users can only update their own profile, admins can update any
    if (user.role !== Role.ADMIN && user.id !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.userProfileService.createOrUpdateProfile(userId, body);
  }
}
