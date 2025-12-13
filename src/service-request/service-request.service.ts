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
} from './dto';

@Injectable()
export class ServiceRequestService {
  constructor(private prisma: PrismaService) {}

  // Service Type Methods

  /**
   * Create a new service type
   */
  async createServiceType(dto: CreateServiceTypeDto) {
    // Check if service type with same name already exists
    const existing = await this.prisma.serviceType.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(
        `Service type with name "${dto.name}" already exists`,
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

  /**
   * Get all service types (active ones for dropdown)
   */
  async getAllServiceTypes(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.serviceType.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get a single service type by ID
   */
  async getServiceTypeById(id: string) {
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id },
    });

    if (!serviceType) {
      throw new NotFoundException(`Service type with ID "${id}" not found`);
    }

    return serviceType;
  }

  // Service Request Methods

  /**
   * Create a new service request for a user
   */
  async createServiceRequest(userId: string, dto: CreateServiceRequestDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify service type exists and is active
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id: dto.serviceTypeId },
    });

    if (!serviceType) {
      throw new NotFoundException(
        `Service type with ID "${dto.serviceTypeId}" not found`,
      );
    }

    if (!serviceType.isActive) {
      throw new BadRequestException(
        `Service type "${serviceType.name}" is not currently available`,
      );
    }

    return this.prisma.serviceRequest.create({
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
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all service requests for a specific user (My Requests page)
   */
  async getUserServiceRequests(userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return this.prisma.serviceRequest.findMany({
      where: { userId },
      include: {
        serviceType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single service request by ID
   */
  async getServiceRequestById(requestId: string, userId?: string) {
    const where: any = { id: requestId };
    if (userId) {
      where.userId = userId; // Ensure user can only access their own requests
    }

    const request = await this.prisma.serviceRequest.findFirst({
      where,
      include: {
        serviceType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(
        `Service request with ID "${requestId}" not found`,
      );
    }

    return request;
  }

  /**
   * Update service request status (for admins/officers)
   */
  async updateServiceRequestStatus(
    requestId: string,
    dto: UpdateRequestStatusDto,
  ) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(
        `Service request with ID "${requestId}" not found`,
      );
    }

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.verificationStatus)
      updateData.verificationStatus = dto.verificationStatus;
    if (dto.remarks) updateData.remarks = dto.remarks;

    return this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: updateData,
      include: {
        serviceType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete a service request (user can delete their own requests)
   */
  async deleteServiceRequest(requestId: string, userId: string) {
    const request = await this.prisma.serviceRequest.findFirst({
      where: {
        id: requestId,
        userId, // Ensure user can only delete their own requests
      },
    });

    if (!request) {
      throw new NotFoundException(
        `Service request with ID "${requestId}" not found or you don't have permission to delete it`,
      );
    }

    return this.prisma.serviceRequest.delete({
      where: { id: requestId },
    });
  }

  /**
   * Get all service requests (for admin/officer view)
   */
  async getAllServiceRequests(filters?: {
    status?: string;
    verificationStatus?: string;
    serviceTypeId?: string;
  }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.verificationStatus)
      where.verificationStatus = filters.verificationStatus;
    if (filters?.serviceTypeId) where.serviceTypeId = filters.serviceTypeId;

    return this.prisma.serviceRequest.findMany({
      where,
      include: {
        serviceType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

