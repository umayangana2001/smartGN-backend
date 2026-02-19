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

  // ==================== SERVICE TYPE ====================

  async createServiceType(dto: CreateServiceTypeDto) {
    const existing = await this.prisma.serviceType.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(
        `Service type "${dto.name}" already exists`,
      );
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
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.serviceType.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getServiceTypeById(id: string) {
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id },
    });

    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    return serviceType;
  }

  async deleteServiceType(id: string) {
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id },
      include: { requests: true },
    });

    if (!serviceType) {
      throw new NotFoundException('Service type not found');
    }

    if (serviceType.requests.length > 0) {
      throw new BadRequestException(
        'Cannot delete service type with existing requests',
      );
    }

    return this.prisma.serviceType.delete({
      where: { id },
    });
  }

  // ==================== SERVICE REQUEST ====================

  async createServiceRequest(
    userId: string,
    dto: CreateServiceRequestDto,
    token?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id: dto.serviceTypeId },
    });

    if (!serviceType)
      throw new NotFoundException('Service type not found');

    if (!serviceType.isActive)
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
      include: {
        serviceType: true,
        user: {
          select: { id: true, email: true },
        },
      },
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

  async getServiceRequestById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const request = await this.prisma.serviceRequest.findFirst({
      where,
      include: {
        serviceType: true,
        user: { select: { id: true, email: true } },
      },
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
      throw new NotFoundException('Request not found or unauthorized');

    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  async getAllServiceRequests(filters?: {
    status?: string;
    verificationStatus?: string;
    serviceTypeId?: string;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.verificationStatus)
      where.verificationStatus = filters.verificationStatus;
    if (filters?.serviceTypeId)
      where.serviceTypeId = filters.serviceTypeId;

    return this.prisma.serviceRequest.findMany({
      where,
      include: {
        serviceType: true,
        user: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestByDivisionAndId(
    divisionId: string,
    requestId: string,
  ) {
    const request = await this.prisma.serviceRequest.findFirst({
      where: {
        id: requestId,
        user: {
          profile: {
            divisionId: divisionId,
          },
        },
      },
      include: {
        serviceType: true,
        user: { include: { profile: true } },
      },
    });

    if (!request)
      throw new NotFoundException(
        'Request not found for this division',
      );

    return request;
  }

  async gnApproveRejectRequest(
    requestId: string,
    dto: GnRequestActionDto,
    token: string,
  ) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request)
      throw new NotFoundException('Service request not found');

    const newStatus =
      dto.action === RequestStatus.ACCEPTED
        ? RequestStatus.ACCEPTED
        : RequestStatus.REJECTED;

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        remarks: dto.remarks,
      },
    });

    await this.sendNotification(token, {
      userId: request.userId,
      role: 'CITIZEN',
      title:
        newStatus === RequestStatus.ACCEPTED
          ? 'Request Accepted'
          : 'Request Rejected',
      message:
        newStatus === RequestStatus.ACCEPTED
          ? 'Your service request has been accepted.'
          : `Your request was rejected.`,
    });

    return updated;
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
    } catch (error: any) {
      console.error('Notification error:', error?.message);
    }
  }
}
