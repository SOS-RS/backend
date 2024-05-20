import { Module } from '@nestjs/common';

import { ShelterSupplyService } from './shelter-supply.service';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemCleanupService } from './item-cleanup.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService, ItemCleanupService],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
