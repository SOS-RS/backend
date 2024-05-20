import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { differenceInHours, parseISO } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyPriority } from 'src/supply/types';

@Injectable()
export class ShelterSupplyCleanupService {
  private logger = new Logger('ShelterSupplyCleanupService');
  constructor(private readonly prismaService: PrismaService) {}

  @Cron('0 0 */2 * *')
  async handleCron() {
    const shelterSupplies = await this.prismaService.shelterSupply.findMany({
      include: {
        supply: true,
        shelter: true,
      },
    });

    for (const shelterSupply of shelterSupplies) {
      this.logger.log(
        `Verificando necessidade de exclusão de itens no abrigo ${shelterSupply.shelter.name}`,
      );

      if (
        this.canRemoveShelterSupply(
          shelterSupply.createdAt,
          shelterSupply.updatedAt,
          shelterSupply.priority,
        )
      ) {
        await this.removeShelterSupply(
          shelterSupply.supply.id,
          shelterSupply.shelterId,
          shelterSupply.supply.name,
        );
      }
    }
  }

  hasPassed48Hours(
    createdAt: string | null,
    updatedAt: string | null,
  ): boolean {
    const targetDate = updatedAt
      ? parseISO(updatedAt)
      : createdAt
        ? parseISO(createdAt)
        : null;

    if (!targetDate) {
      return false;
    }

    const hoursDifference = differenceInHours(new Date(), targetDate);

    return hoursDifference >= 48;
  }

  private async removeShelterSupply(
    supplyId: string,
    shelterId: string,
    supplyName: string,
  ) {
    this.logger.log(
      `Suprimento ${supplyName} já está há 48 horas com baixa movimentação e não é urgente. Removendo relação com o abrigo ${shelterId}`,
    );

    try {
      await this.prismaService.$transaction([
        this.prismaService.shelterSupply.deleteMany({
          where: {
            supplyId,
            shelterId,
          },
        }),
        this.prismaService.supplyAutoRemoveLog.create({
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
        }),
      ]);
    } catch (error) {
      this.logger.error(
        `Erro ao tentar remover o suprimento ${supplyId} do abrigo ${shelterId}`,
        (error as Error).stack,
      );
    }
  }

  private canRemoveShelterSupply(
    createdAt: string | null,
    updatedAt: string | null,
    priority: SupplyPriority,
  ): boolean {
    const hasPassedTime = this.hasPassed48Hours(createdAt, updatedAt);

    const isNotUrgent = priority !== SupplyPriority.Urgent;

    return isNotUrgent && hasPassedTime;
  }
}
