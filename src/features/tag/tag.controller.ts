import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Tag, TagDocument } from './tag.entity';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<TagDocument[]> {
    return this.tagService.findAll();
  }

  @Post()
  async create(@Body() tag: Tag): Promise<TagDocument> {
    return this.tagService.create(tag);
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<TagDocument | null> {
    return this.tagService.findByName(name);
  }
}
