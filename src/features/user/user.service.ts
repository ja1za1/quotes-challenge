import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<UserDocument> {
    const hashedPassword = await this.hashPassword(user.password);
    const userWithHashedPassword: User = { ...user, password: hashedPassword };
    const createdUser = new this.userModel(userWithHashedPassword);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOneByName(name: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new NotFoundException(`User with name ${name} not found`);
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
