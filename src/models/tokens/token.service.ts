import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token) private readonly tokenModel: typeof Token) {}

  async saveToken(userId: number, accessToken: string, refreshToken: string, expiresAt: Date) {
    const tokenData = await this.tokenModel.findOne({ where: { userId } });
    
    if (tokenData) {
      tokenData.accessToken = accessToken;
      tokenData.refreshToken = refreshToken;
      tokenData.expiresAt = expiresAt;
      await tokenData.save();
    } else {
      const tokenToCreate = {
        userId,
        accessToken,
        refreshToken,
        expiresAt,
      };

      await this.tokenModel.create(tokenToCreate as Token);
    }
  }

  async deleteToken(userId: number) {
    await this.tokenModel.destroy({ where: { userId } });
  }

  async getTokenByAccessToken(accessToken: string): Promise<Token | null> {
    return await this.tokenModel.findOne({ where: { accessToken } });
  }

  async updateAccessToken(userId: number, newAccessToken: string): Promise<void> {
    await this.tokenModel.update(
      { accessToken: newAccessToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      { where: { userId } }
    );
  }

  async updateTokens(userId: number, newAccessToken: string, newRefreshToken: string): Promise<void> {
    await this.tokenModel.update(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      { where: { userId } }
    );
  }
}
