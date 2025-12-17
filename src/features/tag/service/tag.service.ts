import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTagDto } from '../dto/create-tag.dto';
import { InternalTagDto } from '../dto/internal-tag.dto';
import { ResponseTagDto } from '../dto/response-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}
  private readonly logger = new Logger(TagService.name);

  async findAll(): Promise<ResponseTagDto[]> {
    const tags = await this.tagModel.find().exec();
    return tags.map((tag) => ResponseTagDto.fromEntity(tag));
  }

  async create(tag: CreateTagDto): Promise<ResponseTagDto> {
    const newTag = new this.tagModel(tag);
    const createdTag = await newTag.save();
    return ResponseTagDto.fromEntity(createdTag);
  }

  async checkIfExists(name: string): Promise<boolean> {
    const tag = await this.findByName(name);
    return !!tag;
  }

  async updateTag(updateTag: UpdateTagDto): Promise<ResponseTagDto> {
    const updatedTag = await this.tagModel
      .findOneAndUpdate({ name: updateTag.name }, updateTag, { new: true })
      .exec();
    if (!updatedTag) {
      throw new NotFoundException(`Tag with name ${updateTag.name} not found`);
    }

    return ResponseTagDto.fromEntity(updatedTag);
  }

  async insertIfNotExists(tagNames: string[]): Promise<Types.ObjectId[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    const normalizedTags = this.normalizeTagNames(tagNames);

    const tagIds: Types.ObjectId[] = [];

    for (const tagName of normalizedTags) {
      let tag: ResponseTagDto;
      try {
        tag = await this.findByName(tagName);
      } catch (error) {
        if (error instanceof NotFoundException) {
          tag = await this.create({
            name: tagName,
          });
        } else {
          this.logger.error(error);
          continue;
        }
      }

      tagIds.push(tag._id);
    }

    return tagIds;
  }

  async findByName(name: string): Promise<ResponseTagDto> {
    const tag = await this.tagModel.findOne({ name }).exec();

    if (!tag) {
      throw new NotFoundException(`No tag with name ${name} found`);
    }

    return ResponseTagDto.fromEntity(tag);
  }

  async findByNameInternal(name: string): Promise<InternalTagDto | undefined> {
    const tag = await this.tagModel.findOne({ name }).exec();

    if (!tag) {
      return undefined;
    }

    return InternalTagDto.fromEntity(tag);
  }

  private normalizeTagNames(tagNames: string[]): string[] {
    return [
      ...new Set(
        tagNames
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
          .map((tag) => tag.toLowerCase()),
      ),
    ];
  }
}
