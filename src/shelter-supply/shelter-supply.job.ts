import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { addHours } from '@/utils';
import { priorityExpiryInterval } from './constants';
import { SupplyPriority } from '../supply/types';
import { ShelterSupplyService } from './shelter-supply.service';

@Injectable()
export class ShelterSupplyJob {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shelterSupplyService: ShelterSupplyService,
  ) {}

  private readonly logger = new Logger(ShelterSupplyJob.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.log(`${ShelterSupplyJob.name} running`);

    const expiryDate = addHours(
      new Date(Date.now()),
      -priorityExpiryInterval,
    ).toString();

    const outdatedSupplies = await this.prismaService.shelterSupply.findMany({
      where: {
        AND: [
          { priority: SupplyPriority.Urgent },
          {
            createdAt: {
              lte: expiryDate,
            },
          },
        ],
      },
      select: {
        supplyId: true,
        shelterId: true,
      },
    });

    outdatedSupplies.forEach(async (s) => {
      const { shelterId, supplyId } = s;
      await this.shelterSupplyService.update({
        data: {
          priority: SupplyPriority.Needing,
        },
        where: { shelterId: shelterId, supplyId: supplyId },
      });
    });
  }
}
