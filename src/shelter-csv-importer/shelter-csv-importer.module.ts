import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShelterCsvImporterService } from './shelter-csv-importer.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterCsvImporterService],
})
export class ShelterCsvImporterModule {}
