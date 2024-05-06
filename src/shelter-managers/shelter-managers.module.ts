import { Module } from '@nestjs/common';

import { ShelterManagersService } from './shelter-managers.service';
import { ShelterManagersController } from './shelter-managers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShelterManagersService],
  controllers: [ShelterManagersController],
})
export class ShelterManagersModule {}
