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
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceRequestService } from './service-request.service';
import {
  CreateServiceTypeDto,
  CreateServiceRequestDto,
  UpdateRequestStatusDto,
} from './dto';
import { GnRequestActionDto } from './dto/gn-request-action.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('service-request')
@ApiBearerAuth('JWT-auth')
@Controller('service-request')
export class ServiceRequestController {
  constructor(private service: ServiceRequestService) {}

  // SERVICE TYPE

  @Post('service-type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createServiceType(@Body() dto: CreateServiceTypeDto) {
    return this.service.createServiceType(dto);
  }

  @Get('service-types')
  @UseGuards(JwtAuthGuard)
  getServiceTypes(@Query('includeInactive') includeInactive?: string) {
    return this.service.getAllServiceTypes(includeInactive === 'true');
  }

  @Get('service-type/:id')
  @UseGuards(JwtAuthGuard)
  getServiceType(@Param('id') id: string) {
    return this.service.getServiceTypeById(id);
  }

  @Delete('service-type/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteServiceType(@Param('id') id: string) {
    return this.service.deleteServiceType(id);
  }

  // SERVICE REQUEST

  @Post('request/:userId')
  @UseGuards(JwtAuthGuard)
  createRequest(
    @Param('userId') userId: string,
    @Body() dto: CreateServiceRequestDto,
    @Req() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.service.createServiceRequest(userId, dto, token);
  }

  @Get('requests/:userId')
  @UseGuards(JwtAuthGuard)
  getUserRequests(@Param('userId') userId: string) {
    return this.service.getUserServiceRequests(userId);
  }

  @Get('request/:id')
  @UseGuards(JwtAuthGuard)
  getRequest(@Param('id') id: string) {
    return this.service.getServiceRequestById(id);
  }

  @Put('request/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.service.updateServiceRequestStatus(id, dto);
  }

  @Delete('request/:id/:userId')
  @UseGuards(JwtAuthGuard)
  deleteRequest(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.service.deleteServiceRequest(id, userId);
  }
}
