import { GnService } from './gn.service';
export declare class GnController {
    private readonly gnService;
    constructor(gnService: GnService);
    getDashboard(req: any): Promise<{
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
                status: import("../entities/request-status.enum").RequestStatus;
            }[];
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
}
