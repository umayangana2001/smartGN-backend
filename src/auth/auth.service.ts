import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserType } from '../entities/user-type.enum'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<any> {
    const user = await this.usersRepository.findOne({ 
      where: { username } 
    });
    
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string) {
    const user = await this.usersRepository.findOne({ 
      where: { username } 
    });

    if (!user) {
      throw new Error('User not found');
    }

    
    const payload = { 
      username: user.username, 
      userId: user.id,
      userType: user.userType 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        userType: user.userType, 
      }
    };
  }
}