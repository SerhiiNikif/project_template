import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './config/app/config.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get(AppConfigService);

  app.use(cookieParser());

  app.enableCors({
    origin: appConfig.isProduction
      ? 'https://my-production-domain.com'
      : '*', // Allow all in development
  });

  await app.listen(appConfig.port);
  console.log(
    `Application is running on: ${appConfig.isProduction
      ? `http://${appConfig.host}:${appConfig.port}`
      : `http://${appConfig.host}:${appConfig.port}`}`
  );
}

bootstrap();
