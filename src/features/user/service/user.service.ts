import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthUserDto } from '../dto/auth-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<ResponseUserDto> {
    const hashedPassword = await this.hashPassword(user.password);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return ResponseUserDto.fromEntity(await createdUser.save());
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => ResponseUserDto.fromEntity(user));
  }

  async findOneByName(name: string): Promise<ResponseUserDto> {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new NotFoundException(`User with name ${name} not found`);
    }
    return ResponseUserDto.fromEntity(user);
  }

  async findForAuth(name: string): Promise<AuthUserDto> {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new NotFoundException(`User with name ${name} not found`);
    }
    return AuthUserDto.fromEntity(user);
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
