import { Module } from '@nestjs/common';

import { SuppliesHistoryService } from './supplies-history.service';
import { SuppliesHistoryController } from './supplies-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SuppliesHistoryService],
  controllers: [SuppliesHistoryController],
  exports: [SuppliesHistoryService],
})
export class SuppliesHistoryModule {}
