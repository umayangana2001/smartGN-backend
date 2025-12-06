
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(3015);
  console.log(`🚀 Server running on http://localhost:3015`);
  console.log(`📊 Test endpoint: http://localhost:3015/test`);
  console.log(`📊 Database test: http://localhost:3015/test-db`);
}
bootstrap();