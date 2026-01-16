import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Content Marketing Service')
    .setDescription(
      `
      Content Marketing Service API for Unified Health Global SaaS Marketing Platform.

      ## Features
      - Content Management (CRUD operations, publishing, scheduling)
      - Version Control
      - Content Intelligence (topics, clusters, performance analytics)
      - AI-Assisted Content Generation (outlines, briefs, repurposing)
      - Full-text Search
      - Media Management with S3 integration

      ## Authentication
      All endpoints require JWT authentication via Bearer token.
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Content', 'Content management endpoints')
    .addTag('Intelligence', 'Content intelligence and analytics endpoints')
    .addTag('Health', 'Health check and metrics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/docs`);
  logger.log(`API Prefix: ${apiPrefix}`);
}

bootstrap();
