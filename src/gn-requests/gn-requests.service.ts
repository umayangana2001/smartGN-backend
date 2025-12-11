
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { RequestStatus } from '../entities/request-status.enum';

@Injectable()
export class GnRequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  
  async createRequest(requestData: any): Promise<any> {
    console.log('Creating request with data:', requestData);
    
    try {
      const newRequest = this.requestsRepository.create({
        userId: requestData.userId || requestData.user_id,
        gnId: requestData.gnId || requestData.gn_id,
        requestDate: new Date(requestData.requestDate || requestData.request_date),
        requestType: requestData.requestType || requestData.request_type,
        description: requestData.description,
        status: RequestStatus.PENDING,
        createdAt: new Date(),
      });

      const savedRequest = await this.requestsRepository.save(newRequest);
      console.log('Request created successfully with ID:', savedRequest.id);
      return savedRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  
  async getAllRequests(): Promise<Request[]> {
    console.log('Getting all requests');
    try {
      return await this.requestsRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error('Error getting all requests:', error);
      throw error;
    }
  }

  
  async getRequestById(id: number): Promise<Request | null> {
    console.log('Getting request by ID:', id);
    try {
      return await this.requestsRepository.findOne({
        where: { id }
      });
    } catch (error) {
      console.error('Error getting request by ID:', error);
      throw error;
    }
  }

  
  async verifyRequest(id: number, verifyData: any): Promise<any> {
    console.log('Verifying request ID:', id, 'with data:', verifyData);
    try {
      const request = await this.getRequestById(id);
      if (!request) {
        throw new Error(`Request with ID ${id} not found`);
      }

      request.status = RequestStatus.VERIFIED;
      
      if (verifyData.verification_date || verifyData.verificationDate) {
        request.verificationDate = new Date(verifyData.verification_date || verifyData.verificationDate);
      } else {
        request.verificationDate = new Date();
      }

      const updatedRequest = await this.requestsRepository.save(request);
      console.log('Request verified successfully:', updatedRequest.id);
      return updatedRequest;
    } catch (error) {
      console.error('Error verifying request:', error);
      throw error;
    }
  }

  
  async declineRequest(id: number, declineData: any): Promise<any> {
    console.log('Declining request ID:', id, 'with data:', declineData);
    try {
      const request = await this.getRequestById(id);
      if (!request) {
        throw new Error(`Request with ID ${id} not found`);
      }

      request.status = RequestStatus.DECLINED;
      const updatedRequest = await this.requestsRepository.save(request);
      console.log('Request declined successfully:', updatedRequest.id);
      return updatedRequest;
    } catch (error) {
      console.error('Error declining request:', error);
      throw error;
    }
  }

  
  async uploadDocument(id: number, uploadData: any): Promise<any> {
    console.log('Uploading document for request ID:', id, 'data:', uploadData);
    
    try {
      const request = await this.getRequestById(id);
      if (!request) {
        throw new Error(`Request with ID ${id} not found`);
      }

      const timestamp = Date.now();
      const fileName = `document-${id}-${timestamp}.jpg`;
      const filePath = `/uploads/documents/${fileName}`;
      
      console.log('Document upload simulated for request:', {
        requestId: id,
        filePath: filePath,
        description: uploadData.description
      });

      return {
        success: true,
        message: 'Document uploaded successfully',
        requestId: id,
        filePath: filePath,
        data: {
          fileName: fileName,
          description: uploadData.description || 'Supporting document'
        }
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  
  async uploadCertificate(id: number, certificateData: any): Promise<any> {
    console.log('=== UPLOAD CERTIFICATE START ===');
    console.log('Request ID:', id);
    console.log('Certificate data:', {
      hasFile: !!certificateData?.file,
      fileName: certificateData?.file?.originalname,
      description: certificateData?.description
    });
    
    try {
      
      if (!certificateData || !certificateData.file) {
        throw new Error('No file provided in the request');
      }


      const request = await this.getRequestById(id);
      if (!request) {
        throw new Error(`Request with ID ${id} not found`);
      }

      console.log('Current request status:', request.status);

      
      const allowedStatuses = [
        RequestStatus.VERIFIED, 
        RequestStatus.PENDING, 
        RequestStatus.COMPLETED
      ];
      
      if (!allowedStatuses.includes(request.status)) {
        throw new Error(
          `Cannot upload certificate for request with status: ${request.status}. ` +
          `Must be ${RequestStatus.VERIFIED}, ${RequestStatus.PENDING}, or ${RequestStatus.COMPLETED}.`
        );
      }

      
      const timestamp = Date.now();
      const originalName = certificateData.file.originalname || 'certificate.jpg';
      const fileExtension = originalName.split('.').pop() || 'jpg';
      const fileName = `certificate-${id}-${timestamp}.${fileExtension}`;
      const filePath = `/uploads/certificates/${fileName}`;
      
      
      const description = certificateData.description || 'Certificate document';
      
      console.log('Saving certificate:', {
        fileName: fileName,
        filePath: filePath,
        description: description
      });

      
      request.certificateUrl = filePath;
      request.status = RequestStatus.COMPLETED;
      
      const updatedRequest = await this.requestsRepository.save(request);
      
      console.log('=== UPLOAD CERTIFICATE SUCCESS ===');
      console.log('Database updated with certificate URL:', filePath);

      
      return {
        success: true,
        message: 'Certificate uploaded successfully and request marked as completed',
        requestId: id,
        certificateUrl: filePath,
        data: {
          fileName: fileName,
          filePath: filePath,
          status: RequestStatus.COMPLETED,
          description: description,
          originalFileName: originalName,
          uploadedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('=== UPLOAD CERTIFICATE ERROR ===');
      console.error('Error:', error.message);
      
      
      throw error;
    }
  }

  
  async completeRequest(id: number, completeData: any): Promise<any> {
    console.log('Completing request ID:', id, 'with data:', completeData);
    try {
      const request = await this.getRequestById(id);
      if (!request) {
        throw new Error(`Request with ID ${id} not found`);
      }

      if (request.status !== RequestStatus.VERIFIED) {
        throw new Error(`Cannot complete request with status: ${request.status}. Must be verified.`);
      }

      request.status = RequestStatus.COMPLETED;
      if (completeData.certificate_url || completeData.certificateUrl) {
        request.certificateUrl = completeData.certificate_url || completeData.certificateUrl;
      }

      const updatedRequest = await this.requestsRepository.save(request);
      console.log('Request completed successfully:', updatedRequest.id);
      return updatedRequest;
    } catch (error) {
      console.error('Error completing request:', error);
      throw error;
    }
  }

  
  async getStatistics(): Promise<any> {
    console.log('Getting request statistics');
    try {
      const allRequests = await this.getAllRequests();
      
      const stats = {
        total: allRequests.length,
        pending: allRequests.filter(r => r.status === RequestStatus.PENDING).length,
        verified: allRequests.filter(r => r.status === RequestStatus.VERIFIED).length,
        completed: allRequests.filter(r => r.status === RequestStatus.COMPLETED).length,
        declined: allRequests.filter(r => r.status === RequestStatus.DECLINED).length,
        byType: allRequests.reduce((acc, req) => {
          acc[req.requestType] = (acc[req.requestType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}