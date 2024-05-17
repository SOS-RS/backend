import { Module } from '@nestjs/common';

import { ShelterService } from './shelter.service';
import { ShelterController } from './shelter.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ShelterCsvImporterModule } from 'src/shelter-csv-importer/shelter-csv-importer.module';

@Module({
  imports: [PrismaModule, ShelterCsvImporterModule],
  providers: [ShelterService],
  controllers: [ShelterController],
})
export class ShelterModule {}
