/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { TagService } from '../tag/tag.service';

@Injectable()
export class CrawlerService implements OnModuleDestroy {
  constructor(private tagsService: TagService) {}
  private browser: puppeteer.Browser;

  async crawlQuotesByTag(tag: string) {
    const url = `http://quotes.toscrape.com/tag/${encodeURIComponent(tag)}/`;

    const page = await this.browser.newPage();

    try {
      await page.setUserAgent({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const data = await page.evaluate(() => {
        const quoteElements = Array.from(document.querySelectorAll('.quote'));
        const quotes: {
          quote: string;
          author: string;
          authorAbout: string;
          tags: string[];
        }[] = [];
        for (const quoteElement of quoteElements) {
          const text =
            quoteElement.querySelector('.text')?.textContent?.trim() ??
            'No text';
          const author =
            quoteElement.querySelector('.author')?.textContent?.trim() ??
            'Unknown';
          const authorBioLink =
            quoteElement
              .querySelector('a[href*="/author/"]')
              ?.getAttribute('href')
              ?.trim() ?? 'Unknown';
          const tags = Array.from(quoteElement.querySelectorAll('.tag')).map(
            (el) => el.textContent?.trim(),
          );

          quotes.push({
            quote: text,
            author,
            authorAbout: authorBioLink,
            tags,
          });
        }
        return quotes;
      });

      return data;
    } finally {
      await page.close();
    }
  }

  async onModuleInit() {
    this.browser = await puppeteer.launch();
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
