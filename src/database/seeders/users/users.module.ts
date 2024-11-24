import { Module } from '@nestjs/common';
import { UserSeederService } from './users.service';
import { UsersModule } from '@/models/users/users.module';
import { AppConfigService } from '@/config/app/config.service';

@Module({
  imports: [UsersModule],
  providers: [UserSeederService, AppConfigService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
