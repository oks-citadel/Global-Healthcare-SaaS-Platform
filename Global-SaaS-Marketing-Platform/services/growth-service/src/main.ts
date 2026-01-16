import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation pipe
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

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Growth Service API')
    .setDescription(
      'Growth marketing service - campaigns, landing pages, referrals, A/B testing, and virality features',
    )
    .setVersion('1.0')
    .addTag('campaigns', 'Campaign management')
    .addTag('utm', 'UTM link tracking')
    .addTag('landing', 'Landing page management')
    .addTag('ab-test', 'A/B testing')
    .addTag('cro', 'Conversion rate optimization')
    .addTag('referrals', 'Referral program')
    .addTag('affiliates', 'Affiliate program')
    .addTag('rewards', 'Rewards management')
    .addBearerAuth()
    .addServer('/api/v1', 'API v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3004;
  await app.listen(port);

  console.log(`Growth Service running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
