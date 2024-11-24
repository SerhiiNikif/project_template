import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { compileTemplate } from '@/common/helpers/template.helper';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.GOOGLE_GEN_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async sendMail(to: string, subject: string, template: string, context: Record<string, any>): Promise<void> {
    const html = compileTemplate(template, context);
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  }
}
