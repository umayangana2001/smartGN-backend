import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { execSync } from 'child_process';

async function bootstrap() {
  // Automatically run pending database migrations on startup
  // Set AUTO_MIGRATE=false in .env to disable this behavior
  if (process.env.AUTO_MIGRATE !== 'false') {
    try {
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      // In production, exit on migration failure to prevent running with outdated schema
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }

  // Optionally run database seed (creates admin user)
  // Set AUTO_SEED=true in .env to enable automatic seeding
  if (process.env.AUTO_SEED === 'true') {
    try {
      console.log('Running database seed...');
      execSync('npm run prisma:seed', { stdio: 'inherit' });
    } catch (error) {
      console.error('Seed failed:', error);
      // Don't exit on seed failure, just log the error
    }
  }

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors();

  // Global validation pipe configuration
  // - whitelist: strips properties that don't have decorators
  // - forbidNonWhitelisted: throws error if non-whitelisted properties are sent
  // - transform: automatically transforms payloads to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI documentation configuration
  const config = new DocumentBuilder()
    .setTitle('GN System API')
    .setDescription('API documentation for GN System - Gram Niladhari Service Management')
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
      persistAuthorization: true, // Persist auth token in Swagger UI
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();

