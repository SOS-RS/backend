import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShelterSupplyLogsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLogs(shelterId: string, supplyId: string) {
    return await this.prismaService.shelterSupplyLog.findMany({
      where: {
        shelterSupplyShelterId: shelterId,
        shelterSupplySupplyId: supplyId,
      },
      select: {
        priority: true,
        quantity: true,
        createdAt: true,
      },
    });
  }

  async addLog(
    shelterId: string,
    supplyId: string,
    priority: number,
    quantity: number,
  ): Promise<void> {
    await await this.prismaService.shelterSupplyLog.create({
      data: {
        shelterSupplyShelterId: shelterId,
        shelterSupplySupplyId: supplyId,
        priority,
        quantity,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
