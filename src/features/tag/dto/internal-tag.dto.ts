import { Types } from 'mongoose';
import { Tag } from '../entity/tag.entity';

export class InternalTagDto {
  public name: string;
  public isSearched: boolean;
  public _id: Types.ObjectId;

  constructor(name: string, isSearched: boolean, _id: Types.ObjectId) {
    this.name = name;
    this.isSearched = isSearched;
    this._id = _id;
  }

  public static fromEntity(tag: Tag): InternalTagDto {
    return new InternalTagDto(tag.name, tag.isSearched, tag._id);
  }
}
