import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
export declare class GnRequestsService {
    private requestsRepository;
    constructor(requestsRepository: Repository<Request>);
    createRequest(requestData: any): Promise<any>;
    getAllRequests(): Promise<Request[]>;
    getRequestById(id: number): Promise<Request | null>;
    verifyRequest(id: number, verifyData: any): Promise<any>;
    declineRequest(id: number, declineData: any): Promise<any>;
    uploadDocument(id: number, uploadData: any): Promise<any>;
    uploadCertificate(id: number, certificateData: any): Promise<any>;
    completeRequest(id: number, completeData: any): Promise<any>;
    getStatistics(): Promise<any>;
}
