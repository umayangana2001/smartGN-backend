import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

type UploadedFile = {
  originalname: string;
  buffer: Buffer;
};

@Injectable()
export class FileUploadService {
  constructor(private prisma: PrismaService) {}

  async saveFile(file: UploadedFile, userId: string) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, file.buffer);

    // Save document record to database
    const document = await this.prisma.userDocument.create({
      data: {
        userId,
        documentName: file.originalname,
        filePath: filePath,
      },
    });

    return {
      id: document.id,
      filePath,
      documentName: file.originalname,
      userId,
      createdAt: document.createdAt,
    };
  }
}
