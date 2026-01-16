import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // OpenAPI/Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Personalization Service')
    .setDescription(
      'API for user profiling, personalization engine, experimentation, and feature flags',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('profiles', 'User profile management')
    .addTag('segments', 'User segmentation')
    .addTag('traits', 'User traits management')
    .addTag('personalization', 'Personalization engine')
    .addTag('experiments', 'A/B testing and experimentation')
    .addTag('feature-flags', 'Feature flag management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Personalization Service running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
