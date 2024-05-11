import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { addHours } from '@/utils';
import { priorityExpiryInterval } from './constants';
import { SupplyPriority } from '../supply/types';
import { ShelterSupplyService } from './shelter-supply.service';

@Injectable()
export class ShelterSupplyExpirationJob {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shelterSupplyService: ShelterSupplyService,
  ) {}

  private readonly logger = new Logger(ShelterSupplyExpirationJob.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log(`${ShelterSupplyExpirationJob.name} running`);

    const expiryDate = addHours(new Date(Date.now()), -priorityExpiryInterval);
    const supplies = await this.prismaService.shelterSupply.findMany({
      select: {
        supplyId: true,
        shelterId: true,
        createdAt: true,
      },
      where: {
        priority: SupplyPriority.Urgent,
      },
    });

    supplies.forEach(async (s) => {
      const { shelterId, supplyId, createdAt } = s;
      if (new Date(createdAt) <= expiryDate) {
        await this.shelterSupplyService.update({
          data: {
            priority: SupplyPriority.Needing,
          },
          where: { shelterId: shelterId, supplyId: supplyId },
        });
      }
    });
  }
}
