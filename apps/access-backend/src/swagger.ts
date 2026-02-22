import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

export async function initSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Access Request System API')
    .setDescription('The Access Request System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      const method = methodKey.charAt(0).toUpperCase() + methodKey.slice(1);
      return method;
    },
  });

  writeFileSync(
    './libs/access-sdk/src/definition.json',
    JSON.stringify(document, null, 2)
  );

  await app.close();
  process.exit(0);
}

initSwagger();
