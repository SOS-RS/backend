import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MigrateDeploy } from '@prisma/migrate/dist/commands/MigrateDeploy';

let cachedServer;
let shouldMigrate = true;

export const handler = async (event, context) => {
  // It is very annoying to run prisma migrations programatically...
  //
  // Hack adapted from:
  //  https://github.com/prisma/prisma/issues/4703#issuecomment-1430112147
  if (shouldMigrate) {
    await new MigrateDeploy().parse([]);
    shouldMigrate = false;
  }

  // Start the server instance
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('SOS - Rio Grande do Sul')
      .setDescription('...')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();

    const instance = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: instance });
  }

  // Serve the request
  return cachedServer(event, context);
};
