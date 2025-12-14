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

@Injectable()
export class UserAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
    if (userRole !== Role.USER && userRole !== Role.ADMIN) {
      throw new BadRequestException('Invalid role for user registration. Only USER or ADMIN allowed.');
    }

    // Hash password
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

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
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
