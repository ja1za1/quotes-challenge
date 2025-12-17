import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { CrawlerModule } from './features/crawler/crawler.module';
import { QuoteModule } from './features/quote/quote.module';
import { TagModule } from './features/tag/tag.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    CrawlerModule,
    TagModule,
    QuoteModule,
    AuthModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
