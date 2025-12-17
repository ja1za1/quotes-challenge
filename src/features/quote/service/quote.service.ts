/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrawlerService } from '../../crawler/service/crawler.service';
import { TagService } from '../../tag/service/tag.service';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { ResponseQuoteDto } from '../dto/response-quote.dto';
import { Quote } from '../entity/quote.entity';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<Quote>,
    private readonly tagService: TagService,
    private readonly crawlerService: CrawlerService,
  ) {}
  private readonly logger = new Logger(QuoteService.name);

  async findAll(): Promise<ResponseQuoteDto[]> {
    const quotes = await this.quoteModel.find().populate('tags').exec();
    return quotes.map((quote) => ResponseQuoteDto.fromEntity(quote));
  }

  async create(quote: CreateQuoteDto): Promise<ResponseQuoteDto> {
    const tagIds = await this.tagService.insertIfNotExists(quote.tags);

    const newQuote = new this.quoteModel({
      quote: quote.quote,
      author: quote.author,
      authorAbout: quote.authorAbout,
      tags: tagIds,
    });

    await newQuote.save();

    return new ResponseQuoteDto(
      quote.quote,
      quote.author,
      quote.authorAbout,
      quote.tags,
    );
  }

  async findByQuote(quoteText: string): Promise<ResponseQuoteDto> {
    const quote = await this.quoteModel
      .findOne({ quote: quoteText })
      .populate('tags')
      .exec();

    if (!quote) {
      throw new NotFoundException(`No quote found for quote ${quoteText}`);
    }

    return ResponseQuoteDto.fromEntity(quote);
  }

  async findByTag(
    tag: string,
  ): Promise<{ quotes: ResponseQuoteDto[]; total: number }> {
    const foundTag = await this.tagService.findByNameInternal(tag);
    if (foundTag?.isSearched) {
      const quotes = await this.quoteModel
        .find({ tags: foundTag })
        .populate('tags')
        .exec();
      const quotesToReturn = quotes.map((quote) =>
        ResponseQuoteDto.fromEntity(quote),
      );
      return {
        total: quotesToReturn.length,
        quotes: quotesToReturn,
      };
    }

    const quotesCrawled = await this.crawlerService.crawlQuotesByTag(tag);

    if (quotesCrawled.length === 0) {
      throw new NotFoundException(
        `No quote with tag ${tag} found on quotes.toscrape`,
      );
    }

    const quotesToReturn = await this.processCrawledQuotes(quotesCrawled);

    await this.tagService.updateTag({ name: tag, isSearched: true });

    return {
      quotes: quotesToReturn,
      total: quotesToReturn.length,
    };
  }

  private async processCrawledQuotes(
    crawledQuotes: CreateQuoteDto[],
  ): Promise<ResponseQuoteDto[]> {
    if (crawledQuotes.length === 0) {
      return [];
    }

    const quotesToReturn: ResponseQuoteDto[] = [];
    for (const quoteData of crawledQuotes) {
      let quote: ResponseQuoteDto;
      try {
        quote = await this.findByQuote(quoteData.quote);
      } catch (error) {
        if (error instanceof NotFoundException) {
          quote = await this.create(quoteData);
        } else {
          this.logger.error(error);
          continue;
        }
      }
      quotesToReturn.push(quote);
    }

    return quotesToReturn;
  }
}
