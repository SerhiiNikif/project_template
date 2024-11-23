import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await app.listen(port);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
