import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name') ?? 'DefaultAppName';
  }

  get env(): string {
    return this.configService.get<string>('app.env') ?? 'development';
  }

  get url(): string {
    return this.configService.get<string>('app.url') ?? 'http://localhost';
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port') ?? 3000);
  }

  get isProduction(): boolean {
    return this.env === 'production';
  }
}
