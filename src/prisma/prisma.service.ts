import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { hooks as userHooks } from './hooks/user';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error' | 'beforeExit'
  >
  implements OnModuleInit
{
  private static instance: PrismaService;

  constructor() {
    super();
  }

  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
      PrismaService.instance.$connect();
    }
    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.$connect();
    this.$use((params, next) => {
      userHooks.forEach((fn) => fn(params));
      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
