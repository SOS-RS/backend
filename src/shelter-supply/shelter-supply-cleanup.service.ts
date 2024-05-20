import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShelterSupply } from '@prisma/client';
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

      await this.removeShelterSupply(shelterSupply);
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

  private async removeShelterSupply(shelterSupply: ShelterSupply) {
    this.logger.log(
      `Suprimento ${shelterSupply.supplyId} já está há 48 horas com baixa movimentação e não é urgente. Removendo relação com o abrigo ${shelterSupply.shelterId}`,
    );

    if (!this.canRemoveShelterSupply(shelterSupply)) return;
    try {
      await this.prismaService.$transaction([
        this.prismaService.shelterSupply.deleteMany({
          where: {
            supplyId: shelterSupply.supplyId,
            shelterId: shelterSupply.shelterId,
          },
        }),
        this.prismaService.supplyAutoRemoveLog.create({
          data: {
            supply: {
              connect: {
                id: shelterSupply.supplyId,
              },
            },
            shelter: {
              connect: {
                id: shelterSupply.shelterId,
              },
            },
            removedAt: new Date().toISOString(),
          },
        }),
      ]);
    } catch (error) {
      this.logger.error(
        `Erro ao tentar remover o suprimento ${shelterSupply.supplyId} do abrigo ${shelterSupply.shelterId}`,
        (error as Error).stack,
      );
    }
  }

  private canRemoveShelterSupply(shelterSupply: ShelterSupply): boolean {
    const hasPassedTime = this.hasPassed48Hours(
      shelterSupply.createdAt,
      shelterSupply.updatedAt,
    );

    const isNotUrgent = shelterSupply.priority !== SupplyPriority.Urgent;

    return isNotUrgent && hasPassedTime;
  }
}
