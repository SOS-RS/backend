import { Module } from '@nestjs/common';

import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SupplyService],
  controllers: [SupplyController],
})
export class SupplyModule {}
