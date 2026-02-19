import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserAuthService } from './user-auth.service';
import { RegisterUserDto, LoginDto } from './dto';
import { Public } from './decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth/user')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  // ================= REGISTER =================
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() dto: RegisterUserDto) {
    return this.userAuthService.register(dto);
  }

  // ================= LOGIN =================
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    return this.userAuthService.login(dto);
  }

  // ================= CHANGE PASSWORD =================
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (Authenticated users only)' })
  async changePassword(
    @Request() req,
    @Body() dto: ChangePasswordDto,
  ) {
    // 🔥 IMPORTANT FIX HERE
    const userId = req.user.id;   // NOT sub

    return this.userAuthService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
