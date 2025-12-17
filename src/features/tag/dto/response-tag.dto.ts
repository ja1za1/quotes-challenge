import { Types } from 'mongoose';
import { Tag } from '../entity/tag.entity';

export class ResponseTagDto {
  public name: string;
  public _id: Types.ObjectId;

  constructor(name: string, _id: Types.ObjectId) {
    this.name = name;
    this._id = _id;
  }

  public static fromEntity(tag: Tag): ResponseTagDto {
    return new ResponseTagDto(tag.name, tag._id);
  }
}
