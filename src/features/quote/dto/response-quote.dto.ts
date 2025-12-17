import { Quote } from '../entity/quote.entity';

export class ResponseQuoteDto {
  public quote: string;
  public author: string;
  public authorAbout: string;
  public tags: string[];

  constructor(
    quote: string,
    author: string,
    authorAbout: string,
    tags: string[],
  ) {
    this.quote = quote;
    this.author = author;
    this.authorAbout = authorAbout;
    this.tags = tags;
  }

  public static fromEntity(quote: Quote): ResponseQuoteDto {
    return new ResponseQuoteDto(
      quote.quote,
      quote.author,
      quote.authorAbout,
      quote.tags.map((tag) => tag.name),
    );
  }
}
