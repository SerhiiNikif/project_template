import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Injectable()
export class MysqlConfigService {
  constructor(private configService: ConfigService) {}

  get dialect(): Dialect {
    const dialect = this.configService.get<string>('database.dialect') as Dialect;
    if (!dialect) {
      throw new Error('Database dialect is not defined');
    }
    return dialect;
  }
  
  get host(): string {
    const host = this.configService.get<string>('database.host');
    if (!host) {
      throw new Error('Database host is not defined');
    }
    return host;
  }

  get port(): number {
    const port = Number(this.configService.get<number>('database.port'));
    return isNaN(port) ? 3306 : port;
  }

  get username(): string {
    return this.configService.get<string>('database.username') ?? 'root';
  }

  get password(): string {
    return this.configService.get<string>('database.password') ?? '';
  }

  get database(): string {
    return this.configService.get<string>('database.database') ?? 'test';
  }
}
