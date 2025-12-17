import { TagService } from './service/tag.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagController } from './controller/tag.controller';
import { Tag, TagSchema } from './entity/tag.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
