import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { QuoteService } from '../service/quote.service';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  async findAll() {
    return this.quoteService.findAll();
  }

  @Post()
  async create(@Body() quote: CreateQuoteDto) {
    return this.quoteService.create(quote);
  }

  @Get(':searchTag')
  async searchByTag(@Param('searchTag') tag: string) {
    return await this.quoteService.findByTag(tag);
  }
}
