
import { Controller, Get, Query } from '@nestjs/common';
import { GnUsersService } from './gn-users.service';

@Controller('gn/users')
export class GnUsersController {
  constructor(private readonly gnUsersService: GnUsersService) {}

  @Get()
  async getUsers(@Query('gnId') gnId?: number) {
    
    if (!gnId) {
      
      return this.gnUsersService.getAllUsers();
    }
    return this.gnUsersService.getUsersByGn(gnId);
  }

  @Get('search')
  async searchUser(@Query('nic') nic: string) {
    if (!nic) {
      return { error: 'NIC parameter is required' };
    }
    return this.gnUsersService.searchUserByNIC(nic);
  }
}