import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false })
  first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  role: string;

  @Column({ type: DataType.STRING, defaultValue: 'active' })
  status?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  email_verified?: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  confirm_token?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  confirm_token_type?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  confirm_token_expires?: Date | null;
}
