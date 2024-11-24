import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app/config.module';
import { MysqlDatabaseProviderModule } from './config/database/mysql/provider.module';
import { UsersModule } from './models/users/users.module';
import { UserSeederModule } from './database/seeders/users/users.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database/mysql/configuration';
import { DatabaseService } from './database/database.service';
import { TokenModule } from './models/tokens/token.module';
import { MailModule } from './mails/mail.module';
import { HealthController } from './common/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    AppConfigModule,
    MysqlDatabaseProviderModule,
    UsersModule,
    UserSeederModule,
    AuthModule,
    TokenModule,
    MailModule
  ],
  providers: [DatabaseService],
  controllers: [HealthController],
})
export class AppModule {}
