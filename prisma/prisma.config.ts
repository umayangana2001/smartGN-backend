// For Prisma v6 configuration
import { PrismaClient } from '@prisma/client';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;