import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppConfigService } from './config/app/config.service';

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
  console.log(`Application is running on: ${appConfig.url}:${appConfig.port}`);
}

bootstrap();
