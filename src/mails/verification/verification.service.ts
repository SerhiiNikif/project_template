import { Injectable } from '@nestjs/common';
import { MailService } from '../mail.service';

@Injectable()
export class VerificationService {
  constructor(private readonly mailService: MailService) {}

  async sendVerificationEmail(email: string, verificationLink: string): Promise<void> {
    await this.mailService.sendMail(email, 'Email Verification', 'verification', {
      verificationLink,
    });
  }
}
