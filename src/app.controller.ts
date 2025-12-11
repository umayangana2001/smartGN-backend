
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'SmartGN Backend API',
      version: '1.0',
      endpoints: {
        test: 'GET /test',
        testDb: 'GET /test-db',
        requests: 'GET /requests',
        gnRequests: 'GET /gn/requests',
        gnUsers: 'GET /gn/users',
      }
    };
  }

  @Get('test')
  getTest() {
    return { message: 'Test endpoint working!' };
  }

  @Get('test-db')
  getTestDb() {
    return { message: 'Database test endpoint' };
  }
}