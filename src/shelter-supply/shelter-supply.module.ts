import { Module } from '@nestjs/common';

import { ShelterSupplyService } from './shelter-supply.service';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
