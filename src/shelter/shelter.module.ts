import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyService } from '../shelter-supply/shelter-supply.service';
import { ShelterController } from './shelter.controller';
import { ShelterService } from './shelter.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterService, ShelterSupplyService],
  controllers: [ShelterController],
})
export class ShelterModule {}
