import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * 
 * Extends PrismaClient to provide database access throughout the application.
 * Handles connection lifecycle automatically.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/test',
        },
      },
      // Log all Prisma operations for debugging
      // In production, consider reducing to ['warn', 'error'] only
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected to database');
  }

  /**
   * Disconnect from database when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected from database');
  }
}
