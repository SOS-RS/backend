import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  const config = new DocumentBuilder()
    .setTitle('SOS - Rio Grande do Sul')
    .setDescription('...')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const HOST = process.env.HOST || '127.0.0.1';
  const PORT = Number(process.env.PORT) || 3000;
  app.enableCors({ origin: [/^(.*)/] });

  await app.listen(PORT, HOST, () => {
    console.log(`Listening on: ${HOST}:${PORT}`);
  });
}

bootstrap();
