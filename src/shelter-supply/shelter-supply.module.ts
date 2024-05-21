import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyController } from './shelter-supply.controller';
import { ShelterSupplyService } from './shelter-supply.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyService],
  controllers: [ShelterSupplyController],
})
export class ShelterSupplyModule {}
