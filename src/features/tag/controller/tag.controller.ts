import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Tag } from '../entity/tag.entity';
import { TagService } from '../service/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll() {
    return this.tagService.findAll();
  }

  @Post()
  async create(@Body() tag: Tag) {
    return this.tagService.create(tag);
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return this.tagService.findByName(name);
  }
}
