import { Injectable } from '@nestjs/common';

/**
 * Application Service
 * 
 * Provides basic application-level services.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple greeting message
   * Used for health checks and API verification
   */
  getHello(): string {
    return 'Hello World!';
  }
}
