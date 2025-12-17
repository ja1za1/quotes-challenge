import { TagModule } from '../tag/tag.module';
import { CrawlerService } from './service/crawler.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [TagModule],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
