import { Module } from '@nestjs/common';

import { ShelterService } from './shelter.service';
import { ShelterController } from './shelter.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShelterService],
  controllers: [ShelterController],
})
export class ShelterModule {}
