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
    const { priority, ...rest } = CreateSupplySchema.parse(body);
    await this.prismaService.supply.create({
      data: {
        priority,
        ...rest,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateSupplySchema>) {
    const { priority, ...rest } = UpdateSupplySchema.parse(body);

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

  async index() {
    const data = await this.prismaService.supply.findMany({
      select: {
        id: true,
        name: true,
        priority: true,
        supplyCategory: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        updatedAt: true,
        createdAt: true,
      },
    });
    return data;
  }
}
