import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateGnDto } from './dto/create-gn.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Get } from '@nestjs/common';
import { Patch, Param } from '@nestjs/common';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Create GN (Village Officer)
   * Only ADMIN can create GN accounts
   */
  @Post('create-gn')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create GN (ADMIN only)' })
  createGN(@Body() dto: CreateGnDto) {
    return this.adminService.createGN(dto);
  }
  @Get('gns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiOperation({ summary: 'Get all GNs (ADMIN only)' })
getAllGNs() {
  return this.adminService.getAllGNs();
}

@Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiOperation({ summary: 'Admin dashboard statistics' })
getDashboard() {
  return this.adminService.getDashboardStats();
}


@Patch('gn/:id/deactivate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiOperation({ summary: 'Deactivate GN (ADMIN only)' })
deactivateGN(@Param('id') id: string) {
  return this.adminService.deactivateGN(id);
}


}
