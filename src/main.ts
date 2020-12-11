import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      exposedHeaders: ['Authorization']
    },
  });
  app.enableCors();

  await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();
