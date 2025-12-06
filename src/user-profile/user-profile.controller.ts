import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { MyInfoDto } from './dto/my-info.dto';

@ApiTags('user-profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by userId' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  getProfile(@Param('userId') userId: string) {
    return this.userProfileService.getUserProfile(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create or update user profile' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiBody({ type: MyInfoDto })
  @ApiResponse({
    status: 200,
    description: 'User profile created or updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  saveProfile(@Param('userId') userId: string, @Body() body: MyInfoDto) {
    return this.userProfileService.createOrUpdateProfile(userId, body);
  }
}
