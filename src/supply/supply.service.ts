import z from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplySchema, UpdateSupplySchema } from './types';

@Injectable()
export class SupplyService {
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

  async store(body: z.infer<typeof CreateSupplySchema>) {
    const { priority, shelterId, ...rest } = CreateSupplySchema.parse(body);
    await this.handleUpdateShelterSum(shelterId, 0, priority);
    await this.prismaService.supply.create({
      data: {
        shelterId,
        priority,
        ...rest,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateSupplySchema>) {
    const { priority, ...rest } = UpdateSupplySchema.parse(body);

    if (priority !== null && priority !== undefined) {
      const supply = await this.prismaService.supply.findFirst({
        where: {
          id,
        },
        select: {
          shelterId: true,
          priority: true,
        },
      });
      if (supply)
        await this.handleUpdateShelterSum(
          supply.shelterId,
          supply.priority,
          priority,
        );
    }

    await this.prismaService.supply.update({
      where: {
        id,
      },
      data: {
        priority,
        ...rest,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async index(id: string) {
    const data = await this.prismaService.supply.findMany({
      where: {
        shelterId: id,
      },
      select: {
        id: true,
        name: true,
        priority: true,
        supplyCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }
}
