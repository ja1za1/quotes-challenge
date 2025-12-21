import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CrawlerModule } from './features/crawler/crawler.module';
import { QuoteModule } from './features/quote/quote.module';
import { TagModule } from './features/tag/tag.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CrawlerModule,
    TagModule,
    QuoteModule,
    AuthModule,
    UserModule,
    MongooseModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URL', 'mongodb://localhost/nest'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
