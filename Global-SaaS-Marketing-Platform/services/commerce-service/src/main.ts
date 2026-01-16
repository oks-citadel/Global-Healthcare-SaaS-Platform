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
    .setTitle('Commerce Service')
    .setDescription(
      'API for upsell/cross-sell offers, promotions, pricing experiments, in-app messages, and trial conversion',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('upsell', 'Upsell offers')
    .addTag('cross-sell', 'Cross-sell offers')
    .addTag('promotions', 'Coupons and promotions')
    .addTag('pricing', 'Pricing experiments')
    .addTag('inapp', 'In-app messages')
    .addTag('trial', 'Trial conversion')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Commerce Service running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
