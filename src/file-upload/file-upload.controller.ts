import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file for a user' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid' },
        filePath: { type: 'string', example: '/uploads/file.pdf' },
        documentName: { type: 'string', example: 'document.pdf' },
        userId: { type: 'string', example: 'user123' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  async uploadFile(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.fileUploadService.saveFile(
      {
        originalname: file.originalname,
        buffer: file.buffer,
      },
      userId,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all uploaded files for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns list of documents' })
  async getFiles(@Param('userId') userId: string) {
    return this.fileUploadService.getFilesByUser(userId);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete a specific file' })
  @ApiParam({ name: 'fileId', description: 'The unique ID of the document' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('fileId') fileId: string) {
    return this.fileUploadService.deleteFile(fileId);
  }
}