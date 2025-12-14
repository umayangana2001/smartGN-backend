import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { execSync } from 'child_process';

async function bootstrap() {
  // Run Prisma migrations automatically on startup
  if (process.env.AUTO_MIGRATE !== 'false') {
    try {
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      // In development, you might want to continue anyway
      // In production, you might want to exit
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('GN System API')
    .setDescription('API documentation for GN System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('user-profile', 'User profile management endpoints')
    .addTag('file-upload', 'File upload endpoints')
    .addTag('service-request', 'Service request management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
  console.log('Swagger documentation available at http://localhost:3000/api');
}
bootstrap();

