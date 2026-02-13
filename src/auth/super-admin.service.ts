import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(dto: CreateAdminDto) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create ADMIN user
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.ADMIN,
        fullName: dto.fullName,
      },
    });
  }
}
