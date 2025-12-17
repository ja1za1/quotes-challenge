import { Tag } from '../entity/tag.entity';

export class CreateTagDto {
  public name: string;
  public isSearched?: boolean;

  constructor(name: string, isSearched: boolean = false) {
    this.name = name;
    this.isSearched = isSearched;
  }

  public static fromEntity(tag: Tag): CreateTagDto {
    return new CreateTagDto(tag.name, tag.isSearched);
  }
}
