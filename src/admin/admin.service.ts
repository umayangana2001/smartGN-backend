import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGnDto } from './dto/create-gn.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new GN (Village Officer)
   * Only ADMIN should be allowed to call this endpoint
   */
  async createGN(dto: CreateGnDto) {
    // 1️⃣ Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3️⃣ Create GN user
    const gn = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.VILLAGE_OFFICER,
        fullName: dto.fullName,
        district: dto.district,
        division: dto.division,
      },
    });

    // 4️⃣ Remove password before returning
    const { password, ...result } = gn;

    return {
      message: 'GN created successfully',
      gn: result,
    };
  }
}
