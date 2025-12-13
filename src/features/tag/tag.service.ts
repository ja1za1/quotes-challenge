import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().exec();
  }

  async create(tag: Tag): Promise<TagDocument> {
    const createdTag = new this.tagModel(tag);
    return createdTag.save();
  }

  async checkIfExists(name: string): Promise<boolean> {
    const tag = await this.findByName(name);
    return !!tag;
  }

  async insertIfNotExists(tagNames: string[]): Promise<TagDocument[]> {
    if (tagNames.length === 0) {
      return [];
    }
    const tags: TagDocument[] = [];
    for (const name of tagNames) {
      const tag = await this.findByName(name);
      if (tag) {
        tags.push(tag);
      } else {
        const createdTag = await this.create({ name });
        tags.push(createdTag);
      }
    }
    return tags;
  }

  async findByName(name: string): Promise<TagDocument | null> {
    const tag = await this.tagModel.findOne({ name }).exec();

    return tag;
  }
}
