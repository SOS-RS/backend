import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { PrismaService } from '../prisma/prisma.service';
import { SupplyPriority } from '../supply/types';
import { getDifferenceInHours } from '../utils';
import { priorityExpiryInterval } from './constants';
import { CreateShelterSupplySchema, UpdateShelterSupplySchema } from './types';

@Injectable()
export class ShelterSupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  private async handleUpdateShelterSum(
    shelterId: string,
    oldPriority: number,
    newPriority: number,
  ) {
    await this.prismaService.shelter.update({
      where: {
        id: shelterId,
      },
      data: {
        prioritySum: {
          increment: newPriority - oldPriority,
        },
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async store(body: z.infer<typeof CreateShelterSupplySchema>) {
    const { shelterId, priority, supplyId } =
      CreateShelterSupplySchema.parse(body);
    await this.handleUpdateShelterSum(shelterId, 0, priority);
    await this.prismaService.shelterSupply.create({
      data: {
        shelterId,
        priority,
        supplyId,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(body: z.infer<typeof UpdateShelterSupplySchema>) {
    const { data, where } = UpdateShelterSupplySchema.parse(body);
    const { priority } = data;
    if (priority !== null && priority !== undefined) {
      const shelterSupply = await this.prismaService.shelterSupply.findFirst({
        where: {
          shelterId: where.shelterId,
          supplyId: where.supplyId,
        },
        select: {
          priority: true,
        },
      });
      if (shelterSupply)
        await this.handleUpdateShelterSum(
          where.shelterId,
          shelterSupply.priority,
          priority,
        );
    }

    await this.prismaService.shelterSupply.update({
      where: {
        shelterId_supplyId: where,
      },
      data: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async index(shelterId: string) {
    return await this.prismaService.shelterSupply.findMany({
      where: {
        shelterId,
      },
      select: {
        priority: true,
        supply: {
          select: {
            id: true,
            name: true,
            supplyCategory: {
              select: {
                id: true,
                name: true,
              },
            },
            updatedAt: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async checkAndUpdateOutdatedPriorities(shelterSupplies: Array<any>) {
    shelterSupplies.forEach((s) => {
      if (
        s.priority === SupplyPriority.Urgent &&
        getDifferenceInHours(
          new Date(s.supply.updatedAt || s.supply.createdAt),
          new Date(Date.now()),
        ) >= priorityExpiryInterval
      ) {
        this.update({
          data: {
            priority: SupplyPriority.Needing,
          },
          where: { shelterId: s.shelterId, supplyId: s.supply.id },
        });
      }
    });
  }
}
