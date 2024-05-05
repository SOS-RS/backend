import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { ShelterModule } from './shelter/shelter.module';
import { SupplyModule } from './supply/supply.module';
import { ServerResponseInterceptor } from './interceptors';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { SupplyCategoriesModule } from './supply-categories/supply-categories.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SessionsModule,
    ShelterModule,
    SupplyModule,
    SupplyCategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ServerResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
