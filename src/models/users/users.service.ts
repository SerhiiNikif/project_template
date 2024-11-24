import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegistrationDto } from '@/auth/dto/register.dot';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async createUser(userData: RegistrationDto): Promise<User> {
    if (!userData.password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToCreate = {
      ...userData, 
      password: hashedPassword,
      
    };
    return this.userModel.create(userToCreate as User);
  }

  async update(id: number, updateData: UpdateUserDto): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    return user;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id } });
    return result > 0;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ where: { phone } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) return user;
    return null;
  }

  async findUser(condition: Partial<User>, fields: string[]): Promise<User | null> {
    return this.userModel.findOne({ where: condition, attributes: fields });
  }

  async updateUser(user: User, updateData: Partial<User>): Promise<void> {
    await user.update(updateData);
  }
}
