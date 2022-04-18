import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { useContainer } from 'class-validator';
import { ProjectModule } from './project/project.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploadedFiles'));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
