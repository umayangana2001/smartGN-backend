import axios from 'axios';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateServiceTypeDto,
  CreateServiceRequestDto,
  UpdateRequestStatusDto,
  GnRequestActionDto,
} from './dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class ServiceRequestService {
  constructor(private prisma: PrismaService) {}

  // ================= SERVICE TYPE =================

  async createServiceType(dto: CreateServiceTypeDto) {
    const existing = await this.prisma.serviceType.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Service type already exists');
    }

    return this.prisma.serviceType.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getAllServiceTypes(includeInactive = false) {
    return this.prisma.serviceType.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getServiceTypeById(id: string) {
    const type = await this.prisma.serviceType.findUnique({
      where: { id },
    });

    if (!type) throw new NotFoundException('Service type not found');
    return type;
  }

  async updateServiceType(id: string, dto: CreateServiceTypeDto) {
    const existing = await this.prisma.serviceType.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException('Service type not found');

    return this.prisma.serviceType.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
      },
    });
  }

  async deleteServiceType(id: string) {
    const type = await this.prisma.serviceType.findUnique({
      where: { id },
      include: { requests: true },
    });

    if (!type) throw new NotFoundException('Service type not found');

    if (type.requests.length > 0) {
      throw new BadRequestException(
        'Cannot delete service type with existing requests',
      );
    }

    return this.prisma.serviceType.delete({
      where: { id },
    });
  }

  // ================= SERVICE REQUEST =================

  async createServiceRequest(
    userId: string,
    dto: CreateServiceRequestDto,
    token?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const type = await this.prisma.serviceType.findUnique({
      where: { id: dto.serviceTypeId },
    });
    if (!type) throw new NotFoundException('Service type not found');
    if (!type.isActive)
      throw new BadRequestException('Service type inactive');

    const request = await this.prisma.serviceRequest.create({
      data: {
        userId,
        serviceTypeId: dto.serviceTypeId,
        documentPath: dto.documentPath,
        remarks: dto.remarks,
        status: 'PENDING',
        verificationStatus: 'PENDING',
      },
      include: { serviceType: true },
    });

    await this.sendNotification(token, {
      userId,
      role: 'CITIZEN',
      title: 'Request Submitted',
      message: 'Your request has been submitted successfully',
    });

    return request;
  }

  async getUserServiceRequests(userId: string) {
    return this.prisma.serviceRequest.findMany({
      where: { userId },
      include: { serviceType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getServiceRequestById(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: { serviceType: true },
    });

    if (!request)
      throw new NotFoundException('Service request not found');

    return request;
  }

  async updateServiceRequestStatus(
    id: string,
    dto: UpdateRequestStatusDto,
  ) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request)
      throw new NotFoundException('Service request not found');

    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: dto.status,
        verificationStatus: dto.verificationStatus,
        remarks: dto.remarks,
      },
    });
  }

  async deleteServiceRequest(id: string, userId: string) {
    const request = await this.prisma.serviceRequest.findFirst({
      where: { id, userId },
    });

    if (!request)
      throw new NotFoundException('Request not found');

    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  private async sendNotification(
    token: string | undefined,
    payload: {
      userId: string;
      role: 'CITIZEN' | 'GN';
      title: string;
      message: string;
    },
  ) {
    if (!token) return;

    try {
      await axios.post(
        'http://localhost:8081/api/notifications',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.log('Notification failed');
    }
  }
}
