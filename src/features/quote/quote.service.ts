/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrawlerService } from '../crawler/crawler.service';
import { TagService } from '../tag/tag.service';
import { Quote, QuoteDocument } from './quote.entity';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<Quote>,
    private readonly tagService: TagService,
    private readonly crawlerService: CrawlerService,
  ) {}

  async findAll(): Promise<QuoteDocument[]> {
    return this.quoteModel.find().exec();
  }

  async create(quote: Quote): Promise<QuoteDocument> {
    const createdQuote = new this.quoteModel(quote);
    const savedQuote = await createdQuote.save();
    return savedQuote.populate('tags', '-_id name');
  }

  async findByTag(tag: string): Promise<QuoteDocument[]> {
    const foundTag = await this.tagService.findByName(tag);
    let quotes: QuoteDocument[] = [];
    if (!foundTag) {
      const quotesCrawled = await this.crawlerService.crawlQuotesByTag(tag);
      for (const quoteData of quotesCrawled) {
        const tagsInserted = await this.tagService.insertIfNotExists(
          quoteData.tags,
        );
        const createdQuote = await this.create({
          ...quoteData,
          tags: tagsInserted,
        });
        quotes.push(createdQuote);
      }
    } else {
      quotes = await this.quoteModel
        .find({ tags: foundTag })
        .populate('tags', '-_id name')
        .exec();
    }
    return quotes;
  }
}
