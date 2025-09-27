import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './common/config/env.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/config/logger.config';

async function bootstrap() {
  // 1. Tạo logger instance trước
  const logger = WinstonModule.createLogger(winstonConfig);

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ⚠️ Xoá field không có trong DTO
      forbidNonWhitelisted: true, // ⚠️ Báo lỗi nếu có field lạ
      transform: true, // ⚠️ Ép kiểu (string → number)
    }),
  );

  app.setGlobalPrefix('api');

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Badminton Shop API')
    .setDescription('API tài liệu cho hệ thống quản lý cửa hàng')
    .setVersion('1.0')
    .addBearerAuth() // nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // http://localhost:1021/api/docs

  await app.listen(getEnv('PORT') ?? 1051);
}
bootstrap();
