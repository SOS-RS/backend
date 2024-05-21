import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShelterSupply } from '@prisma/client';
import { subDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyPriority } from 'src/supply/types';

@Injectable()
export class ShelterSupplyCleanupService {
  private logger = new Logger('ShelterSupplyCleanupService');
  constructor(private readonly prismaService: PrismaService) {}

  @Cron('0 0 */2 * *')
  async handleCron() {
    const shelterSuppliesToDelete = await this.getShelterSuppliesToDelete();

    for (const shelterSupply of shelterSuppliesToDelete) {
      this.logger.log(
        `Verificando necessidade de exclusão de itens no abrigo ${shelterSupply.shelterId}`,
      );

      await this.removeShelterSupply(shelterSupply);
    }
  }

  private async getShelterSuppliesToDelete(): Promise<ShelterSupply[]> {
    const thresholdDate = subDays(new Date(), 2).toISOString();

    return this.prismaService.shelterSupply.findMany({
      where: {
        OR: [
          {
            createdAt: {
              lte: thresholdDate,
            },
            updatedAt: null,
          },
          {
            updatedAt: {
              lte: thresholdDate,
            },
          },
        ],
        priority: {
          not: SupplyPriority.Urgent,
        },
      },
    });
  }

  private async removeShelterSupply(
    shelterSupply: ShelterSupply,
  ): Promise<void> {

    this.logger.log(
      `Suprimento ${shelterSupply.supplyId} já está há 48 horas com baixa movimentação e não é urgente. Removendo relação com o abrigo ${shelterSupply.shelterId}`,
    );

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
}
