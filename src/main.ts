import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  if (config.get('ENABLE_DOCS') === 'true') {
    // Implementing swagger documentation
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Chat App Apis')
      .setDescription('Apis for chat app')
      .setVersion('1.0')
      .addTag('Chat App Swagger Documentation')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-documentation', app, document);
  }

  await app.listen(config.get('PORT'), () => {
    Logger.log(`App is listining on port: ${config.get('PORT')}`);
  });
}
bootstrap();
