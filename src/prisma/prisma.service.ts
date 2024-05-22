import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { hooks as userHooks } from './hooks/user';
import { hooks as shelterSuppliesHooks } from './hooks/shelterSupplies';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error' | 'beforeExit'
  >
  implements OnModuleInit
{
  private logger = new Logger();

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      userHooks.forEach((fn) => fn(params));
      shelterSuppliesHooks.forEach((fn) => fn(this, params));
      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
