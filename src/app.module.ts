import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Дозволяє використовувати змінні середовища глобально
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
