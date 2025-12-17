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

  const config = new DocumentBuilder()
    .setTitle('Quotes Challenge')
    .setDescription('The Quotes Challenge API description')
    .setVersion('1.0')
    .build();

  const apiDoc = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, apiDoc);

  app.use(
    '/docs',
    apiReference({
      content: apiDoc,
      withFastify: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
