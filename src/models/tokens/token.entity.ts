import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column({ type: DataType.TEXT })
  accessToken!: string;

  @Column({ type: DataType.TEXT })
  refreshToken!: string;

  @Column({ type: DataType.DATE })
  expiresAt!: Date;
}
