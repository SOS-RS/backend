import { z } from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShelterSupplySchema,
  UpdateManyShelterSupplySchema,
  UpdateShelterSupplySchema,
} from './types';
import { SupplyPriority } from '../supply/types';

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
    const { shelterId, priority, supplyId, quantity } =
      CreateShelterSupplySchema.parse(body);
    await this.handleUpdateShelterSum(shelterId, 0, priority);
    await this.prismaService.shelterSupply.create({
      data: {
        shelterId,
        priority,
        supplyId,
        quantity: priority !== SupplyPriority.UnderControl ? quantity : null,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(body: z.infer<typeof UpdateShelterSupplySchema>) {
    const { data, where } = UpdateShelterSupplySchema.parse(body);
    const { priority, quantity } = data;
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
        quantity: priority !== SupplyPriority.UnderControl ? quantity : null,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async updateMany(body: z.infer<typeof UpdateManyShelterSupplySchema>) {
    const { ids, shelterId } = UpdateManyShelterSupplySchema.parse(body);

    const supplies = await this.prismaService.shelterSupply.findMany({
      where: {
        shelterId,
        supplyId: {
          in: ids,
        },
      },
    });

    const prioritySum = supplies.reduce(
      (prev, current) => prev + current.priority,
      0,
    );

    await this.prismaService.$transaction([
      this.prismaService.shelter.update({
        where: {
          id: shelterId,
        },
        data: {
          prioritySum: {
            decrement: prioritySum,
          },
          updatedAt: new Date().toISOString(),
        },
      }),
      this.prismaService.shelterSupply.updateMany({
        where: {
          shelterId,
          supplyId: {
            in: ids,
          },
        },
        data: {
          priority: SupplyPriority.UnderControl,
          updatedAt: new Date().toISOString(),
        },
      }),
    ]);
  }

  async index(shelterId: string) {
    return await this.prismaService.shelterSupply.findMany({
      where: {
        shelterId,
      },
      select: {
        priority: true,
        quantity: true,
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
}
