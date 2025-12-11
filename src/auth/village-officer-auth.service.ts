import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterVillageOfficerDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums';

@Injectable()
export class VillageOfficerAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterVillageOfficerDto) {
    // Check if officer already exists
    const existingOfficer = await this.prisma.villageOfficer.findUnique({
      where: { email: dto.email },
    });

    if (existingOfficer) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create village officer
    const officer = await this.prisma.villageOfficer.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        district: dto.district,
        division: dto.division,
        role: Role.VILLAGE_OFFICER,
      },
    });

    // Return officer without password
    const { password, ...result } = officer;
    return {
      message: 'Village Officer registered successfully',
      villageOfficer: result,
    };
  }

  async login(dto: LoginDto) {
    // Find officer by email
    const officer = await this.prisma.villageOfficer.findUnique({
      where: { email: dto.email },
    });

    if (!officer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(dto.password, officer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: officer.id,
      email: officer.email,
      role: officer.role,
      type: 'village_officer',
    };

    const { password, ...officerWithoutPassword } = officer;

    return {
      message: 'Login successful',
      villageOfficer: officerWithoutPassword,
      access_token: this.jwtService.sign(payload),
    };
  }
}
