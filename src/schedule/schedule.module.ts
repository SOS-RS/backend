import { Module } from '@nestjs/common';
import { ItemCleanupService } from './item-cleanup.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ItemCleanupService, PrismaService],
  exports: [ItemCleanupService],
})
export class ScheduleModule {}
