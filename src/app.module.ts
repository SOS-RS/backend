import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ServerResponseInterceptor } from './interceptors';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { ShelterManagersModule } from './shelter-managers/shelter-managers.module';
import { ShelterSupplyLogsModule } from './shelter-supply-logs/shelter-supply-log.module';
import { ShelterSupplyModule } from './shelter-supply/shelter-supply.module';
import { ShelterModule } from './shelter/shelter.module';
import { SupplyCategoriesModule } from './supply-categories/supply-categories.module';
import { SupplyModule } from './supply/supply.module';
import { SupportersModule } from './supporters/supporters.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SessionsModule,
    ShelterModule,
    SupplyModule,
    SupplyCategoriesModule,
    ShelterManagersModule,
    ShelterSupplyModule,
    ShelterSupplyLogsModule,
    PartnersModule,
    SupportersModule,
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
