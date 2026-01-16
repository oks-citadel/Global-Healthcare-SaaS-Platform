import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const host = configService.get<string>('app.host') || '0.0.0.0';
  const apiPrefix = configService.get<string>('app.apiPrefix') || '/api/v1';
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || ['*'];
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';

  // Logger
  app.useLogger(app.get(Logger));

  // Security
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
  }));

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation
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

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('SEO Service API')
      .setDescription(`
# SEO Service for Global SaaS Marketing Platform

This service provides comprehensive SEO capabilities including:

## Core SEO
- Dynamic sitemap generation (XML sitemaps with hreflang support)
- Robots.txt management
- PWA Web App Manifest
- Page SEO metadata management
- Reindex queue management
- Full site SEO audits

## Content SEO
- Keyword research with search volume and intent analysis
- Content optimization with on-page scoring
- Internal linking recommendations
- Content freshness detection
- JSON-LD structured data generation

## Technical SEO
- Core Web Vitals monitoring (LCP, CLS, INP)
- Page speed diagnostics
- Mobile-friendly testing
- Accessibility auditing (WCAG)
- Index coverage analysis
- Canonical URL validation
- Hreflang tag mapping
      `)
      .setVersion('1.0.0')
      .setContact(
        'Marketing Platform Team',
        'https://example.com',
        'platform@example.com',
      )
      .addTag('SEO - Sitemap', 'Dynamic sitemap generation and management')
      .addTag('SEO - Robots.txt', 'Robots.txt configuration')
      .addTag('SEO - Web App Manifest', 'PWA manifest configuration')
      .addTag('SEO - Pages', 'Page SEO metadata management')
      .addTag('SEO - Reindex', 'Sitemap refresh and URL reindexing')
      .addTag('SEO - Audit', 'SEO audit and crawl management')
      .addTag('SEO - Keywords', 'Keyword research and tracking')
      .addTag('SEO - Content Optimization', 'Content analysis and optimization')
      .addTag('SEO - Internal Links', 'Internal linking analysis')
      .addTag('SEO - Content Freshness', 'Content decay detection')
      .addTag('SEO - Structured Data', 'JSON-LD schema generation')
      .addTag('SEO - Core Web Vitals', 'LCP, CLS, INP monitoring')
      .addTag('SEO - Page Speed', 'Page speed diagnostics')
      .addTag('SEO - Mobile Friendly', 'Mobile-friendly testing')
      .addTag('SEO - Accessibility', 'WCAG accessibility auditing')
      .addTag('SEO - Index Coverage', 'Index coverage analysis')
      .addTag('SEO - Canonicals', 'Canonical URL validation')
      .addTag('SEO - Hreflang', 'Hreflang tag mapping')
      .addTag('Health', 'Health checks and probes')
      .addTag('Metrics', 'Prometheus metrics')
      .addServer(`http://localhost:${port}`, 'Development')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port, host);

  console.log(`
  ====================================
  SEO Service is running!
  ====================================
  Environment: ${nodeEnv}
  Host: ${host}
  Port: ${port}
  API Prefix: ${apiPrefix}
  Swagger Docs: http://localhost:${port}/docs
  Health Check: http://localhost:${port}${apiPrefix}/health
  Metrics: http://localhost:${port}${apiPrefix}/metrics
  ====================================
  `);
}

bootstrap();
