import { Module } from '@nestjs/common';
import { UserSeederService } from './users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import databaseConfig from '../../config/database/mysql/configuration';
import { AppConfigModule } from '@/config/app/config.module';
import { MysqlDatabaseProviderModule } from '@/config/database/mysql/provider.module';
import { UsersModule } from '@/models/users/users.module';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<string>('database.dialect') as Dialect,
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AppConfigModule,
    MysqlDatabaseProviderModule,
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class SeederModule {}
