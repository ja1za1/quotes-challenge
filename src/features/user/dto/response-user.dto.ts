import { Types } from 'mongoose';
import { User } from '../entity/user.entity';

export class ResponseUserDto {
  public name: string;
  public _id: Types.ObjectId;

  constructor(name: string, _id: Types.ObjectId) {
    this.name = name;
    this._id = _id;
  }

  public static fromEntity(user: User): ResponseUserDto {
    return new ResponseUserDto(user.name, user._id);
  }
}
