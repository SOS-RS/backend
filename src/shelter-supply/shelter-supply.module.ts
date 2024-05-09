import { Module } from '@nestjs/common';

import { ShelterSupplyService } from './shelter-supply.service';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyJob } from './shelter-supply.job';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService, ShelterSupplyJob],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
