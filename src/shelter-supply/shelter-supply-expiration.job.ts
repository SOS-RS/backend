import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { addHours } from '@/utils';
import { priorityExpiryInterval, jobInterval } from './constants';
import { SupplyPriority } from '../supply/types';
import { ShelterSupplyService } from './shelter-supply.service';

@Injectable()
export class ShelterSupplyExpirationJob {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shelterSupplyService: ShelterSupplyService,
  ) {}

  private readonly logger = new Logger(ShelterSupplyExpirationJob.name);

  @Cron(jobInterval)
  async handleCron() {
    this.logger.log(`${ShelterSupplyExpirationJob.name} running`);

    const expiryDate = addHours(new Date(Date.now()), -priorityExpiryInterval);
    await this.prismaService.shelterSupply.updateMany({
      data: {
        priority: SupplyPriority.Needing,
      },
      where: {
        priority: SupplyPriority.Urgent,
        createdAt: {
          lte: expiryDate,
        },
      },
    });
  }
}
