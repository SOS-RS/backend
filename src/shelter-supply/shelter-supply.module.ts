import { Module } from '@nestjs/common';

import { ShelterSupplyService } from './shelter-supply.service';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyExpirationJob } from './shelter-supply-expiration.job';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService, ShelterSupplyExpirationJob],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
