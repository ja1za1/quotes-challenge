import { Body, Controller, Get, Post } from '@nestjs/common';
import { User, UserDocument } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<UserDocument> {
    return this.usersService.create(user);
  }
}
