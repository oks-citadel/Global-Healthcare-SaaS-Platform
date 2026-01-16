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
    .setTitle('AI Intelligence Service')
    .setDescription(
      'AI-powered lead scoring, churn prediction, campaign forecasting, and content generation API',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('leads', 'Predictive lead scoring endpoints')
    .addTag('churn', 'Churn prediction endpoints')
    .addTag('expansion', 'Expansion opportunity prediction endpoints')
    .addTag('campaigns', 'Campaign forecasting endpoints')
    .addTag('seo', 'SEO opportunity discovery endpoints')
    .addTag('recommendations', 'Growth recommendations endpoints')
    .addTag('content', 'AI content generation and optimization endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`AI Service is running on port ${port}`);
  console.log(`Swagger documentation available at /docs`);
}

bootstrap();
