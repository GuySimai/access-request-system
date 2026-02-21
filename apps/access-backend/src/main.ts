import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Setup Swagger documentation (only in local development for security)
  if (process.env.APP_ENV === 'local') {
    const config = new DocumentBuilder()
      .setTitle('Access Request System')
      .setDescription(
        'Internal service for managing application access requests'
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  if (process.env.APP_ENV === 'local') {
    Logger.log(`GraphQL Playground: http://localhost:${port}/graphql`);
    Logger.log(`Swagger Documentation: http://localhost:${port}/docs`);
  }
}

bootstrap();
