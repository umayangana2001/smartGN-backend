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
  async getAllGNs() {
  const gns = await this.prisma.user.findMany({
    where: {
      role: Role.VILLAGE_OFFICER,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      district: true,
      division: true,
      createdAt: true,
    },
  });

  return {
    count: gns.length,
    gns,
  };
}
async deactivateGN(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!user || user.role !== Role.VILLAGE_OFFICER) {
    throw new ConflictException('GN not found');
  }

  const updated = await this.prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  const { password, ...result } = updated;

  return {
    message: 'GN deactivated successfully',
    gn: result,
  };
}
async getDashboardStats() {
  // 👥 User statistics
  const totalUsers = await this.prisma.user.count({
    where: { role: 'USER' },
  });

  const totalGNs = await this.prisma.user.count({
    where: { role: 'VILLAGE_OFFICER' },
  });

  const activeGNs = await this.prisma.user.count({
    where: { role: 'VILLAGE_OFFICER', isActive: true },
  });

  const inactiveGNs = await this.prisma.user.count({
    where: { role: 'VILLAGE_OFFICER', isActive: false },
  });

  // 📢 Complaint statistics
  const totalComplaints = await this.prisma.complaint.count();

  const pendingComplaints = await this.prisma.complaint.count({
    where: { status: 'PENDING' },
  });

  const inReviewComplaints = await this.prisma.complaint.count({
    where: { status: 'IN_REVIEW' },
  });

  const resolvedComplaints = await this.prisma.complaint.count({
    where: { status: 'RESOLVED' },
  });

  const rejectedComplaints = await this.prisma.complaint.count({
    where: { status: 'REJECTED' },
  });

  // 📝 Service Request statistics
  const totalRequests = await this.prisma.serviceRequest.count();

  const pendingRequests = await this.prisma.serviceRequest.count({
    where: { status: 'PENDING' },
  });

  const inProgressRequests = await this.prisma.serviceRequest.count({
    where: { status: 'IN_PROGRESS' },
  });

  const completedRequests = await this.prisma.serviceRequest.count({
    where: { status: 'COMPLETED' },
  });

  const rejectedRequests = await this.prisma.serviceRequest.count({
    where: { status: 'REJECTED' },
  });

  return {
    users: {
      totalUsers,
      totalGNs,
      activeGNs,
      inactiveGNs,
    },
    complaints: {
      totalComplaints,
      pendingComplaints,
      inReviewComplaints,
      resolvedComplaints,
      rejectedComplaints,
    },
    serviceRequests: {
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      rejectedRequests,
    },
  };
}

}
