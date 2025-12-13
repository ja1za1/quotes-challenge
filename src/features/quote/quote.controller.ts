import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Quote, QuoteDocument } from './quote.entity';
import { QuoteService } from './quote.service';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  async findAll(): Promise<QuoteDocument[]> {
    return this.quoteService.findAll();
  }

  @Post()
  async create(@Body() quote: Quote): Promise<QuoteDocument> {
    return this.quoteService.create(quote);
  }

  @Get(':searchTag')
  async searchByTag(@Param('searchTag') tag: string) {
    return {
      quotes: await this.quoteService.findByTag(tag),
    };
  }
}
