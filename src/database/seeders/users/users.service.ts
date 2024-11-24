import { Injectable } from '@nestjs/common';
import { User } from '../../../models/users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { initialUsers } from './data';
import { AppConfigService } from '@/config/app/config.service';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private appConfigService: AppConfigService
  ) {}

  async seed() {
    if (!this.appConfigService.isProduction) {
      for (const user of initialUsers) {
        const userExists = await this.userModel.findOne({ where: { email: user.email } });
        if (!userExists) {
          await this.userModel.create(user as User);
        }
      }
    } else {
      console.log('Skipping test data in production');
    }
  }
}
