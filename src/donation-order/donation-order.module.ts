import { Module } from '@nestjs/common';

import { DonationOrderService } from './donation-order.service';
import { DonationOrderController } from './donation-order.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DonationOrderService],
  controllers: [DonationOrderController],
})
export class DonationOrderModule {}
