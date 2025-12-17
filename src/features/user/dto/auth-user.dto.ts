import { Types } from 'mongoose';
import { User } from '../entity/user.entity';

export class AuthUserDto {
  public name: string;
  public password: string;
  public _id?: Types.ObjectId;

  constructor(name: string, password: string, _id?: Types.ObjectId) {
    this.name = name;
    this._id = _id;
    this.password = password;
  }

  public static fromEntity(user: User): AuthUserDto {
    return new AuthUserDto(user.name, user.password, user._id);
  }
}
