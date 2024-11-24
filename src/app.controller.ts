import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `Hello from Nest.js! ${process.env.DB_NAME}`;
  }
}
