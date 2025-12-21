import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from 'node_modules/@scalar/nestjs-api-reference/dist';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const configService = app.get(ConfigService);
  const apiDocsConfig = new DocumentBuilder()
    .setTitle('Quotes Challenge')
    .setDescription('The Quotes Challenge API description')
    .setVersion('1.0')
    .build();

  const apiDoc = SwaggerModule.createDocument(app, apiDocsConfig);
  // SwaggerModule.setup('docs', app, apiDoc);

  app.use(
    '/v1/api/docs',
    apiReference({
      content: apiDoc,
      withFastify: true,
    }),
  );

  app.setGlobalPrefix('/v1/api');
  const port = configService.get<number>('API_PORT', 3000);
  const baseUrl = configService.get<string>('API_BASE_URL', 'http://localhost');
  const logger = new Logger('App');

  await app.listen(port).then(() => {
    logger.log(`API rodando na porta ${port}`);
    logger.log(`Documentaçao em ${baseUrl}:${port}/v1/api/docs`);
  });
}
bootstrap();
