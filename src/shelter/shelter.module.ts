import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PopulateShelterCity } from './populateShelterCity.cron';
import { ShelterService } from './shelter.service';
import { ShelterController } from './shelter.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  providers: [ShelterService, PopulateShelterCity],
  controllers: [ShelterController],
})
export class ShelterModule {}
