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
    .setTitle('Reputation Management Service')
    .setDescription(
      'Manage reviews, ratings, testimonials, NPS, CSAT, trust badges, and social mentions',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('reviews', 'Review management endpoints')
    .addTag('testimonials', 'Testimonial management endpoints')
    .addTag('nps', 'Net Promoter Score survey endpoints')
    .addTag('csat', 'Customer Satisfaction survey endpoints')
    .addTag('badges', 'Trust badge management endpoints')
    .addTag('mentions', 'Social mention tracking endpoints')
    .addTag('ratings', 'Aggregate rating statistics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`Reputation Service is running on port ${port}`);
  console.log(`Swagger documentation available at /docs`);
}

bootstrap();
