
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GnService } from './gn.service'; 

@Controller('gn')
export class GnController {
  constructor(private readonly gnService: GnService) {}

  @Get('dashboard')
  async getDashboard(@Req() req) {
    
    const gnId = 1;
    return this.gnService.getDashboardStats(gnId);
  }
}