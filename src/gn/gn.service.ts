
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { RequestStatus } from '../entities/request-status.enum'; 

@Injectable()
export class GnService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async getDashboardStats(gnId: number) {
    try {
      const today = new Date();
      
      const todayStr = today.toISOString().split('T')[0];

      
      const [totalRequests, pendingRequests, verifiedToday] = await Promise.all([
        this.requestsRepository.count({ where: { gnId: gnId } }), 
        this.requestsRepository.count({ 
          where: { 
            gnId: gnId, 
            status: RequestStatus.PENDING 
          } 
        }),
        this.requestsRepository.count({ 
          where: { 
            gnId: gnId, 
            status: RequestStatus.VERIFIED, 
            
            verificationDate: new Date(todayStr)
          } 
        }),
      ]);

      
      const recentRequests = await this.requestsRepository.find({
        where: { gnId: gnId }, 
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: 5
      });

      return {
        success: true,
        data: {
          stats: {
            totalRequests,
            pendingRequests,
            verifiedToday,
            completedRequests: totalRequests - pendingRequests,
          },
          recentRequests: recentRequests.map(req => ({
            id: req.id,
            userName: req.user?.username || 'Unknown',
            requestType: req.requestType, // FIXED: requestType not request_type
            date: req.requestDate, // FIXED: requestDate not request_date
            status: req.status
          }))
        }
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}