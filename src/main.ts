import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('GN System API')
    .setDescription('API documentation for GN System')
    .setVersion('1.0')
    .addTag('user-profile', 'User profile management endpoints')
    .addTag('file-upload', 'File upload endpoints')
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
