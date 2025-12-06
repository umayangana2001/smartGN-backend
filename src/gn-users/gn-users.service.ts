
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class GnUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get all users
  async getAllUsers(): Promise<User[]> {
    console.log('Getting all users');
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  
  async getUsersByGn(gnId: number): Promise<any[]> {
    console.log('Getting users for GN:', gnId);
    
    return [];
  }

  
  async searchUserByNIC(nic: string): Promise<User | null> {
    console.log('Searching user by NIC:', nic);
    try {
      return await this.userRepository.findOne({
        where: { nic },
        select: ['id', 'username', 'nic', 'email', 'userType'] 
      });
    } catch (error) {
      console.error('Error searching user by NIC:', error);
      throw error;
    }
  }
}