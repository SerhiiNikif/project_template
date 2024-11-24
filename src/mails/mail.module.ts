import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { VerificationService } from './verification/verification.service';

@Module({
  providers: [MailService, VerificationService],
  exports: [MailService, VerificationService],
})
export class MailModule {}
