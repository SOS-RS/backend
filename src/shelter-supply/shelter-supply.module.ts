import { Module } from '@nestjs/common';

import { ShelterSupplyService } from './shelter-supply.service';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyCleanupService } from './shelter-supply-cleanup.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService, ShelterSupplyCleanupService],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
