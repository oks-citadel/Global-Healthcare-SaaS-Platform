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

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Community Service API')
    .setDescription('Internal Community and Social Analytics APIs for the Global SaaS Marketing Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Community - Posts', 'Community post management')
    .addTag('Community - Comments', 'Comment management')
    .addTag('Community - Reactions', 'Reactions and engagement')
    .addTag('Community - Moderation', 'Content moderation')
    .addTag('Community - Trending', 'Trending topics and posts')
    .addTag('Social - Analytics', 'Social analytics and tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3020;
  await app.listen(port);

  console.log(`Community Service is running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
