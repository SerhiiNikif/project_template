import {
  Controller,
  Post, Body,
  Res, HttpCode,
  HttpStatus,
  Delete,
  Req,
  Get,
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { RegistrationDto } from './dto/register.dot';

@Controller('auth')
export class AuthController { 
  constructor(
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registrationDto: RegistrationDto, @Res() res: Response) {
    const { accessToken } = await this.authService.register(registrationDto);
    res.cookie('jwt', accessToken, { httpOnly: true, secure: false }); // secure: true для HTTPS
    return res.status(HttpStatus.CREATED).json({message: 'Registration successful'});
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(loginDto);
    res.cookie('jwt', accessToken, { httpOnly: true, secure: false }); // secure: true для HTTPS
    return res.status(HttpStatus.OK).json({message: 'Login successful'});
  }

  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.cookies['jwt']);
    res.cookie('jwt', '', { maxAge: 0 });
    return res.json({ message: 'Logout successful' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const newAccessToken = await this.authService.refreshTokens(req.cookies['jwt']);
    res.cookie('jwt', newAccessToken, { httpOnly: true, secure: false }); // secure: true для HTTPS
    return res.status(HttpStatus.OK).json({ message: 'Token refreshed' });
  }

  @Get('/verify-email/:email/:code')
  async verifyEmail(@Param('email') email: string, @Param('code') code: string): Promise<{ message: string }> {
    await this.authService.verifyEmail(email, code);
    return { message: 'Email verified successfully' };
  }

  @Get('/resend-verify-email/:email')
  async resendVerifyEmail(@Param('email') email: string): Promise<{ message: string }> {
    await this.authService.resendVerificationEmail(email);
    return { message: 'Verification email resent' };
  }
}
