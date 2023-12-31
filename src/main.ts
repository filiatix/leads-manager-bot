import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
}
bootstrap();
