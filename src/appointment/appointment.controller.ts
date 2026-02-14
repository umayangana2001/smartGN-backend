import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum'; // Add this import

@ApiTags('appointments')
@Controller('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: any
  ) {
    return this.appointmentService.create(user.id, createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'RESCHEDULED'] })
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string
  ) {
    return this.appointmentService.findAll(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.appointmentService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: any
  ) {
    return this.appointmentService.update(id, user.id, user.role, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.appointmentService.remove(id, user.id, user.role);
  }

  @Get('officer/:officerId')
  @ApiOperation({ summary: 'Get appointments for an officer' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.VILLAGE_OFFICER) // Fixed: Using enum instead of string
  getOfficerAppointments(@Param('officerId') officerId: string) {
    return this.appointmentService.getOfficerAppointments(officerId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.VILLAGE_OFFICER) // Fixed: Using enum instead of string
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any
  ) {
    return this.appointmentService.update(id, user.id, user.role, { status: status as any });
  }
}