import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/models/users/entities/user.entity';
import { RegistrationDto } from './dto/register.dot';
import { UsersService } from '@/models/users/users.service';
import { LoginDto } from './dto/login.dto';
import dayjs from 'dayjs';
import { TokenService } from '@/models/tokens/token.service';
import { MailService } from '@/mails/mail.service';
import { generateOneTimeCode } from '@/common/helpers/code.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async register(registrationDto: RegistrationDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.createUser(registrationDto);
    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);
    const expiresAt = dayjs().add(1, 'hour').toDate();
    await this.tokenService.saveToken(user.id, accessToken, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUserCredentials(loginDto);
    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);
    const expiresAt = dayjs().add(1, 'hour').toDate();
    await this.tokenService.saveToken(user.id, accessToken, refreshToken, expiresAt);
  
    return { accessToken, refreshToken };
  }

  async logout(accessToken: string | undefined): Promise<void> {
    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    const tokenData = await this.tokenService.getTokenByAccessToken(accessToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.tokenService.deleteToken(tokenData.userId);
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      return this.userModel.findByPk(payload.userId);
    } catch {
      return null;
    }
  }

  async refreshTokens(accessToken: string | undefined): Promise<{ newAccessToken: string }> {
    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }
    const tokenData = await this.tokenService.getTokenByAccessToken(accessToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid access token');
    }

    const currentTime = new Date();

    if (tokenData.expiresAt > currentTime) {
      const newAccessToken = this.createAccessToken(tokenData.userId);
      await this.tokenService.updateAccessToken(tokenData.userId, newAccessToken);

      return { newAccessToken };
    } else {
      const newAccessToken = this.createAccessToken(tokenData.userId);
      const newRefreshToken = this.createRefreshToken(tokenData.userId);
      await this.tokenService.updateTokens(tokenData.userId, newAccessToken, newRefreshToken);

      return { newAccessToken };
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await this.userService.findUser(
      { email, confirm_token: code },
      ['id', 'confirm_token_type', 'confirm_token_expires', 'email_verified'],
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.confirm_token_type !== 'REGISTER') {
      throw new BadRequestException('Invalid token type');
    }

    if (user.confirm_token_expires && new Date(user.confirm_token_expires).getTime() < Date.now()) {
      throw new BadRequestException('Token expired');
    }

    await this.userService.updateUser(user, {
      confirm_token: '',
      confirm_token_type: '',
      confirm_token_expires: null,
      email_verified: true,
    });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userService.findUser(
      { email },
      ['id', 'first_name', 'email', 'confirm_token_type'],
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.confirm_token_type !== 'REGISTER') {
      throw new BadRequestException('Invalid token type');
    }

    const { code, expiresAt } = generateOneTimeCode();

    await this.userService.updateUser(user, {
      confirm_token: code,
      confirm_token_expires: expiresAt,
      confirm_token_type: 'REGISTER',
    });

    await this.mailService.sendMail(
      user.email,
      'Email Verification',
      'verify',
      { verificationLink: `${process.env.CLIENT_URL}/verify/${user.email}/${code}` },
    );
  }

  private async validateUserCredentials(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }

  private createAccessToken(userId: number): string {
    return this.jwtService.sign({ userId });
  }

  private createRefreshToken(userId: number): string {
    return this.jwtService.sign({ userId }, { expiresIn: '7d' });
  }
}
