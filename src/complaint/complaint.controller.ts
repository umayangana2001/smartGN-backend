import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums';

@ApiTags('complaints')
@ApiBearerAuth()
@Controller('complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  // Citizen submit complaint
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit complaint (USER only)' })
  createComplaint(@Request() req, @Body() dto: CreateComplaintDto) {
    return this.complaintService.createComplaint(req.user.sub, dto);
  }

  // Admin view all complaints
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all complaints (ADMIN only)' })
  getAllComplaints() {
    return this.complaintService.getAllComplaints();
  }

  // Admin update complaint status
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update complaint status (ADMIN only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintService.updateStatus(id, dto);
  }
}
