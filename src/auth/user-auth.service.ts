import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums';

/**
 * User Authentication Service
 *
 * Handles public user (citizen) registration and authentication.
 * Higher privileged roles (ADMIN, GN, SUPER_ADMIN) are created via
 * controlled internal processes only.
 */
@Injectable()
export class UserAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new USER (Citizen)
   *
   * NOTE:
   * - Public registration allows ONLY USER role
   * - ADMIN, GN, SUPER_ADMIN are NOT allowed here
   */
  async register(dto: RegisterUserDto) {
    // 1️⃣ Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3️⃣ Create USER (Citizen) only
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // 4️⃣ Remove password from response
    const { password, ...result } = user;

    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  /**
   * Authenticate user and generate JWT token
   *
   * Works for:
   * USER / GN / ADMIN / SUPER_ADMIN
   */
  async login(dto: LoginDto) {
    // 1️⃣ Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2️⃣ Validate password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3️⃣ JWT payload (role-based access)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'user',
    };

    // 4️⃣ Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token: this.jwtService.sign(payload),
    };
  }
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
  // 1️⃣ Find user
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // 2️⃣ Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  // 3️⃣ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4️⃣ Update password
  await this.prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    message: 'Password changed successfully',
  };
}

}
