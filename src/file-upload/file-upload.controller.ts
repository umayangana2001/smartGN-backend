import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
  NotFoundException,
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

  // ================= UPLOAD =================
  @Post(':userId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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

  // ================= GET FILES BY USER =================
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all uploaded files for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns list of documents' })
  async getFiles(@Param('userId') userId: string) {
    return this.fileUploadService.getFilesByUser(userId);
  }

  // ================= DELETE FILE =================
  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiParam({ name: 'fileId', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('fileId') fileId: string) {
    const result = await this.fileUploadService.deleteFile(fileId);

    if (!result) {
      throw new NotFoundException('File not found');
    }

    return {
      message: 'File deleted successfully',
    };
  }
}
