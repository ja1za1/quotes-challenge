import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return this.usersService.findOneByName(name);
  }

  @Post()
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }
}
