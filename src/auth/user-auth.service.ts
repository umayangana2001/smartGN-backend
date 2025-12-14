import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums';

/**
 * User Authentication Service
 * 
 * Handles user registration and authentication for regular users and admins.
 */
@Injectable()
export class UserAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * 
   * @param dto - Registration data (email, password, optional role)
   * @returns User data without password and success message
   * @throws ConflictException if email already exists
   * @throws BadRequestException if invalid role is provided
   */
  async register(dto: RegisterUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Validate role - only USER or ADMIN allowed for user registration
    const userRole = dto.role || Role.USER;
    if (userRole !== Role.USER && userRole !== Role.VILLAGE_OFFICER) {
      throw new BadRequestException('Invalid role for user registration. Only USER or ADMIN allowed.');
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: userRole,
      },
    });

    // Return user without password
    const { password, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  /**
   * Authenticate user and generate JWT token
   * 
   * @param dto - Login credentials (email, password)
   * @returns User data, access token, and success message
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Don't reveal if password is wrong or user doesn't exist
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token with user information
    // The role is included in the token for role-based authorization
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'user',
    };

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token: this.jwtService.sign(payload),
    };
  }
}
