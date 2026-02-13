import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';

@Injectable()
export class ComplaintService {
  constructor(private readonly prisma: PrismaService) {}

  // Citizen creates complaint
  async createComplaint(userId: string, dto: CreateComplaintDto) {
    const complaint = await this.prisma.complaint.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
      },
    });

    return {
      message: 'Complaint submitted successfully',
      complaint,
    };
  }

  // Admin: View all complaints
  async getAllComplaints() {
    const complaints = await this.prisma.complaint.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      count: complaints.length,
      complaints,
    };
  }

  // Admin: Update complaint status
  async updateStatus(id: string, dto: UpdateComplaintStatusDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: { status: dto.status },
    });

    return {
      message: 'Complaint status updated',
      complaint: updated,
    };
  }
}
