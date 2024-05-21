import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ShelterSupplyLogsController } from './shelter-supply-log.controller';
import { ShelterSupplyLogsService } from './shelter-supply-log.service';

@Module({
  imports: [PrismaModule],
  providers: [ShelterSupplyLogsService],
  controllers: [ShelterSupplyLogsController],
})
export class ShelterSupplyLogsModule {}
