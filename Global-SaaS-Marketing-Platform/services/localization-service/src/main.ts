import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
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
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Localization Service')
    .setDescription(
      'Multi-language support, geo-pricing, regional content, and compliance management API',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('i18n', 'Internationalization endpoints')
    .addTag('pricing', 'Localized pricing endpoints')
    .addTag('geo', 'Geo-detection and content endpoints')
    .addTag('compliance', 'Compliance message endpoints')
    .addTag('analytics', 'Regional analytics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`Localization Service is running on port ${port}`);
  console.log(`Swagger documentation available at /docs`);
}

bootstrap();
