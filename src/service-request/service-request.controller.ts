import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ServiceRequestService } from './service-request.service';
import {
  CreateServiceTypeDto,
  CreateServiceRequestDto,
  UpdateRequestStatusDto,
} from './dto';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('service-request')
@Controller('service-request')
export class ServiceRequestController {
  constructor(private serviceRequestService: ServiceRequestService) {}

  // Service Type Endpoints

  @Post('service-type')
  @ApiOperation({ summary: 'Create a new service type (Admin only)' })
  @ApiBody({ type: CreateServiceTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Service type created successfully',
  })
  @ApiResponse({ status: 400, description: 'Service type already exists' })
  async createServiceType(@Body() dto: CreateServiceTypeDto) {
    return this.serviceRequestService.createServiceType(dto);
  }

  @Get('service-types')
  @ApiOperation({
    summary: 'Get all service types (for dropdown in modal)',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive service types',
  })
  @ApiResponse({
    status: 200,
    description: 'List of service types retrieved successfully',
  })
  async getServiceTypes(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return this.serviceRequestService.getAllServiceTypes(include);
  }

  @Get('service-type/:id')
  @ApiOperation({ summary: 'Get a service type by ID' })
  @ApiParam({ name: 'id', description: 'Service type ID' })
  @ApiResponse({
    status: 200,
    description: 'Service type retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Service type not found' })
  async getServiceType(@Param('id') id: string) {
    return this.serviceRequestService.getServiceTypeById(id);
  }

  // Service Request Endpoints

  @Post('request/:userId')
  @ApiOperation({
    summary: 'Create a new service request (Add Request button)',
  })
  @ApiParam({ name: 'userId', description: 'User ID creating the request' })
  @ApiBody({ type: CreateServiceRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Service request created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid service type or user' })
  async createServiceRequest(
    @Param('userId') userId: string,
    @Body() dto: CreateServiceRequestDto,
  ) {
    return this.serviceRequestService.createServiceRequest(userId, dto);
  }

  @Get('requests/:userId')
  @ApiOperation({
    summary: 'Get all service requests for a user (My Requests page)',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User service requests retrieved successfully',
  })
  async getUserRequests(@Param('userId') userId: string) {
    return this.serviceRequestService.getUserServiceRequests(userId);
  }

  @Get('request/:id')
  @ApiOperation({ summary: 'Get a service request by ID' })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'User ID (optional, for user-scoped access)',
  })
  @ApiResponse({
    status: 200,
    description: 'Service request retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  async getServiceRequest(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.serviceRequestService.getServiceRequestById(id, userId);
  }

  @Put('request/:id/status')
  @ApiOperation({
    summary: 'Update service request status (Admin/Officer only)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiBody({ type: UpdateRequestStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Service request status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.serviceRequestService.updateServiceRequestStatus(id, dto);
  }

  @Delete('request/:id/:userId')
  @ApiOperation({
    summary: 'Delete a service request (Delete Request button)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiParam({ name: 'userId', description: 'User ID (for authorization)' })
  @ApiResponse({
    status: 200,
    description: 'Service request deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service request not found or unauthorized',
  })
  async deleteServiceRequest(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.serviceRequestService.deleteServiceRequest(id, userId);
  }

  @Get('request/:id/download')
  @ApiOperation({
    summary: 'Download document associated with service request',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Document downloaded successfully',
  })
  @ApiResponse({ status: 404, description: 'Request or document not found' })
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const request =
      await this.serviceRequestService.getServiceRequestById(id);

    if (!request.documentPath) {
      throw new NotFoundException('No document found for this request');
    }

    // Construct full file path (adjust based on your file storage structure)
    const filePath = path.resolve(request.documentPath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document file not found on server');
    }

    // Get file name from path
    const fileName = path.basename(filePath);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  // Admin/Officer endpoints

  @Get('requests')
  @ApiOperation({
    summary: 'Get all service requests (Admin/Officer view)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by request status',
  })
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    description: 'Filter by verification status',
  })
  @ApiQuery({
    name: 'serviceTypeId',
    required: false,
    description: 'Filter by service type ID',
  })
  @ApiResponse({
    status: 200,
    description: 'All service requests retrieved successfully',
  })
  async getAllServiceRequests(
    @Query('status') status?: string,
    @Query('verificationStatus') verificationStatus?: string,
    @Query('serviceTypeId') serviceTypeId?: string,
  ) {
    return this.serviceRequestService.getAllServiceRequests({
      status,
      verificationStatus,
      serviceTypeId,
    });
  }
}

