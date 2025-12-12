import { GnRequestsService } from './gn-requests.service';
export declare class GnRequestsController {
    private readonly gnRequestsService;
    constructor(gnRequestsService: GnRequestsService);
    createRequest(requestData: any): Promise<any>;
    findAll(query: any): Promise<import("../entities/request.entity").Request[]>;
    findOne(id: string): Promise<import("../entities/request.entity").Request>;
    verifyRequest(id: string, verifyData: any): Promise<any>;
    declineRequest(id: string, declineData: any): Promise<any>;
    uploadDocument(id: string, uploadData: any): Promise<any>;
    uploadCertificate(id: string, file: Express.Multer.File, body: any): Promise<any>;
    completeRequest(id: string, completeData: any): Promise<any>;
    getStatistics(): Promise<any>;
}
