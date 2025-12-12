import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { RequestStatus } from '../entities/request-status.enum';
export declare class GnService {
    private requestsRepository;
    constructor(requestsRepository: Repository<Request>);
    getDashboardStats(gnId: number): Promise<{
        success: boolean;
        data: {
            stats: {
                totalRequests: number;
                pendingRequests: number;
                verifiedToday: number;
                completedRequests: number;
            };
            recentRequests: {
                id: number;
                userName: any;
                requestType: string;
                date: Date;
                status: RequestStatus;
            }[];
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
}
