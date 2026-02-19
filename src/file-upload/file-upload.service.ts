import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ================= SAVE FILE =================
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

    const document = await this.prisma.userDocument.create({
      data: {
        userId,
        documentName: file.originalname,
        filePath: filePath,
      },
    });

    return {
      id: document.id,
      filePath: document.filePath,
      documentName: document.documentName,
      userId: document.userId,
      createdAt: document.createdAt,
    };
  }

  // ================= DELETE FILE =================
  async deleteFile(fileId: string) {
    // 1️⃣ Find document
    const document = await this.prisma.userDocument.findUnique({
      where: { id: fileId },
    });

    if (!document) {
      throw new NotFoundException('File not found');
    }

    // 2️⃣ Delete physical file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // 3️⃣ Delete database record
    await this.prisma.userDocument.delete({
      where: { id: fileId },
    });

    return true;
  }
}
