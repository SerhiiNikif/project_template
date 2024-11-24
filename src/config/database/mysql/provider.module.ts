import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfigService } from '@/config/app/config.service';
import { AppConfigModule } from '@/config/app/config.module';
import { MysqlConfigService } from './config.service';
import { MysqlConfigModule } from './config.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [MysqlConfigModule, AppConfigModule],
      useFactory: async (
        mysqlConfigService: MysqlConfigService,
        appConfigService: AppConfigService,
      ) => ({
        dialect: mysqlConfigService.dialect,
        host: mysqlConfigService.host,
        port: mysqlConfigService.port,
        username: mysqlConfigService.username,
        password: mysqlConfigService.password,
        database: mysqlConfigService.database,
        autoLoadModels: true,
        synchronize: !appConfigService.isProduction,
      }),
      inject: [MysqlConfigService, AppConfigService],
    }),
  ],
})
export class MysqlDatabaseProviderModule {}
