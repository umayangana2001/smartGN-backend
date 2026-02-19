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
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(dto: RegisterUserDto) {
    // 🔎 Check existing email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

  

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 1️⃣ Create User
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // 2️⃣ Create UserProfile
   await this.prisma.userProfile.create({
  data: {
    userId: user.id,
    fullName: dto.fullName,
    nic: dto.nic,
    email: dto.email,
    telephone: dto.telephone,
    address: '',
    birthday: new Date(),
  },
});


    const { password, ...userWithoutPassword } = user;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  // ================= LOGIN =================
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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

  // ================= CHANGE PASSWORD =================
 async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!userId) {
    throw new UnauthorizedException('User ID missing from token');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    message: 'Password changed successfully',
  };
}

}
