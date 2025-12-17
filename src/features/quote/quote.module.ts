import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrawlerModule } from '../crawler/crawler.module';
import { TagModule } from '../tag/tag.module';
import { QuoteController } from './controller/quote.controller';
import { Quote, QuoteSchema } from './entity/quote.entity';
import { QuoteService } from './service/quote.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    TagModule,
    CrawlerModule,
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
