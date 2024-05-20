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
import { ShelterManagersModule } from './shelter-managers/shelter-managers.module';
import { ShelterSupplyModule } from './shelter-supply/shelter-supply.module';
import { PartnersModule } from './partners/partners.module';
import { SupportersModule } from './supporters/supporters.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ItemCleanupService } from './schedule/item-cleanup.service';


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
    PartnersModule,
    SupportersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ServerResponseInterceptor,
    },
    ItemCleanupService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
