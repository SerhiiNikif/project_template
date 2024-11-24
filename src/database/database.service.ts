import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      console.log('Running migrations...');
      await this.sequelize.sync();
      console.log('Migrations completed.');
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}
