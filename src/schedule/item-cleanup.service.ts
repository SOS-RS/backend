import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyPriority } from 'src/supply/types';

@Injectable()
export class ItemCleanupService {
  private logger = new Logger('ItemCleanupService');
  constructor(private readonly prismaService: PrismaService) {}

  @Cron('0 0 */2 * *')
  async handleCron() {
    const shelters = await this.prismaService.shelter.findMany({
      include: {
        shelterSupplies: {
          include: {
            supply: true,
          },
        },
      },
    });

    for (const shelter of shelters) {
      this.logger.log(
        `Verificando necessidade de exclusão de itens no abrigo ${shelter.name}`,
      );
      for (const shelterSupply of shelter.shelterSupplies) {
        const supply = shelterSupply.supply;
        if (
          this.canRemoveSupply(
            supply.createdAt,
            supply.updatedAt,
            shelterSupply.priority,
          )
        ) {
          this.removeSupply(supply.id, shelter.id, supply.name);
        }
      }
    }
  }

  private hasPassed48Hours(
    createdAt: string | null,
    updatedAt: string | null,
  ): boolean {
    if (updatedAt !== null) {
      const updatedAtTime = new Date(updatedAt).getTime();
      const now = new Date().getTime();
      const difference = now - updatedAtTime;
      const hours = Math.floor(difference / (1000 * 60 * 60));
      return hours >= 48;
    } else {
      const createdAtTime =
        createdAt !== null ? new Date(createdAt).getTime() : 0;
      const now = new Date().getTime();
      const difference = now - createdAtTime;
      const hours = Math.floor(difference / (1000 * 60 * 60));
      return hours >= 48;
    }
  }

  private async removeSupply(
    supplyId: string,
    shelterId: string,
    supplyName: string,
  ) {
    this.logger.log(
      `Suprimento ${supplyName} já está há 48 horas com baixa movimentação e prioridade 0. Removendo do abrigo ${shelterId}`,
    );

    try {
      await this.prismaService.shelterSupply.deleteMany({
        where: {
          supplyId,
          shelterId,
        },
      });

      await this.prismaService.supplyAutoRemoveLog.create({
        data: {
          supply: {
            connect: {
              id: supplyId,
            },
          },
          shelter: {
            connect: {
              id: shelterId,
            },
          },
          removedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.logger.error(
        `Erro ao tentar remover o suprimento ${supplyId} do abrigo ${shelterId}`,
        (error as Error).stack,
      );
    }
  }

  private canRemoveSupply(
    createdAt: string | null,
    updatedAt: string | null,
    priority: SupplyPriority,
  ): boolean {
    const hasPassedTime = this.hasPassed48Hours(createdAt, updatedAt);

    const isNotUrgent = priority !== SupplyPriority.Urgent;

    return isNotUrgent && hasPassedTime;
  }
}
