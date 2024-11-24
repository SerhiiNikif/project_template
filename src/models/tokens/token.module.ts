import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenService } from './token.service';
import { Token } from './token.entity';

@Module({
  imports: [SequelizeModule.forFeature([Token])],
  providers: [TokenService],
  exports: [TokenService, SequelizeModule],
})
export class TokenModule {}
