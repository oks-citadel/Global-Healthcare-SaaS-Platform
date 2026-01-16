import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Analytics & Attribution Service')
    .setDescription(
      `
## Overview
The Analytics & Attribution Service provides comprehensive event tracking, analytics queries,
multi-touch attribution, and behavior analytics capabilities for the Global SaaS Marketing Platform.

## Features
- **Event Tracking**: Real-time event ingestion with Kinesis streams
- **Analytics Queries**: Funnel analysis, cohort analysis, retention curves, LTV, churn analysis
- **Attribution**: Multi-touch attribution models, customer journey mapping
- **Behavior Analytics**: Heatmaps, session recordings, scroll/click maps

## Authentication
All endpoints require a valid JWT token in the Authorization header.

## Rate Limits
- Standard tier: 1,000 requests/minute
- Premium tier: 10,000 requests/minute
- Enterprise tier: Unlimited
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Events', 'Event tracking and ingestion endpoints')
    .addTag('Analytics', 'Analytics query endpoints')
    .addTag('Attribution', 'Attribution and journey mapping endpoints')
    .addTag('Behavior', 'Behavior analytics endpoints')
    .addTag('Health', 'Health and metrics endpoints')
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://analytics-api.unifiedhealth.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Analytics Service running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
