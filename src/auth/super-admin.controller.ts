import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums';
import { CreateAdminDto } from './dto';
import { SuperAdminService } from './super-admin.service';

@ApiTags('Super Admin')
@ApiBearerAuth()
@Controller('super-admin')
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('create-admin')
  @ApiOperation({ summary: 'Create ADMIN (SUPER_ADMIN only)' })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.superAdminService.createAdmin(dto);
  }
}
