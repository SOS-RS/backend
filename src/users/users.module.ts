import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
