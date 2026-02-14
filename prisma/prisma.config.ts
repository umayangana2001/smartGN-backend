// Prisma v7 configuration file.
// Exports config for the Prisma CLI and a function to get client options.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const DEFAULT_DB_URL = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/test';
// For Prisma v6 configuration

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