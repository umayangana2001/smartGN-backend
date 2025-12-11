import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GnRequestsService } from './gn-requests.service';

@Controller('gn/requests')
export class GnRequestsController {
  constructor(private readonly gnRequestsService: GnRequestsService) {}

  
  @Post()
  async createRequest(@Body() requestData: any) {
    try {
      console.log('Creating new request:', requestData);
      return await this.gnRequestsService.createRequest(requestData);
    } catch (error) {
      console.error('Controller error creating request:', error);
      throw new HttpException(
        error.message || 'Failed to create request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Get()
  async findAll(@Query() query: any) {
    try {
      return await this.gnRequestsService.getAllRequests();
    } catch (error) {
      console.error('Controller error getting all requests:', error);
      throw new HttpException(
        error.message || 'Failed to fetch requests',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const request = await this.gnRequestsService.getRequestById(+id);
      if (!request) {
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      }
      return request;
    } catch (error) {
      console.error('Controller error getting request:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  
  @Put(':id/verify')
  async verifyRequest(
    @Param('id') id: string,
    @Body() verifyData: any
  ) {
    try {
      return await this.gnRequestsService.verifyRequest(+id, verifyData);
    } catch (error) {
      console.error('Controller error verifying request:', error);
      throw new HttpException(
        error.message || 'Failed to verify request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Put(':id/decline')
  async declineRequest(
    @Param('id') id: string,
    @Body() declineData: any
  ) {
    try {
      return await this.gnRequestsService.declineRequest(+id, declineData);
    } catch (error) {
      console.error('Controller error declining request:', error);
      throw new HttpException(
        error.message || 'Failed to decline request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Post(':id/documents')
  async uploadDocument(
    @Param('id') id: string,
    @Body() uploadData: any
  ) {
    try {
      return await this.gnRequestsService.uploadDocument(+id, uploadData);
    } catch (error) {
      console.error('Controller error uploading document:', error);
      throw new HttpException(
        error.message || 'Failed to upload document',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Post(':id/certificate')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificate(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    try {
      console.log('=== CONTROLLER: Certificate Upload ===');
      console.log('Request ID:', id);
      console.log('File details:', file ? {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      } : 'No file');
      console.log('Body fields:', body);

      
      if (!file) {
        throw new BadRequestException('No file uploaded. Please select a file.');
      }

      
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, PDF`
        );
      }

      
      const certificateData = {
        file: file,
        description: body.description || 'Certificate document'
      };

      console.log('Sending to service:', {
        hasFile: true,
        description: certificateData.description
      });

      
      const result = await this.gnRequestsService.uploadCertificate(+id, certificateData);
      
      console.log('Certificate upload successful:', result);
      return result;
      
    } catch (error) {
      console.error('=== CONTROLLER: Certificate Upload Error ===');
      console.error('Error:', error.message);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Failed to upload certificate',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Put(':id/complete')
  async completeRequest(
    @Param('id') id: string,
    @Body() completeData: any
  ) {
    try {
      return await this.gnRequestsService.completeRequest(+id, completeData);
    } catch (error) {
      console.error('Controller error completing request:', error);
      throw new HttpException(
        error.message || 'Failed to complete request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
  @Get('stats/statistics')
  async getStatistics() {
    try {
      return await this.gnRequestsService.getStatistics();
    } catch (error) {
      console.error('Controller error getting statistics:', error);
      throw new HttpException(
        error.message || 'Failed to get statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}