import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplyHistorySchema } from './types';
import { SearchSchema } from '../types';

@Injectable()
export class SuppliesHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(shelterId: string, query: any) {
    const { order, orderBy, page, perPage } = SearchSchema.parse(query);

    const where: Prisma.SupplyHistoryWhereInput = {
      shelterId,
    };

    const count = await this.prismaService.supplyHistory.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.SupplyHistoryFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.supplyHistory.findMany({
      ...whereData,
      select: {
        id: true,
        supply: {
          select: {
            measure: true,
            name: true,
          },
        },
        priority: true,
        quantity: true,
        predecessor: {
          select: {
            priority: true,
            quantity: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      page,
      perPage,
      count,
      results,
    };
  }

  async store(body: z.infer<typeof CreateSupplyHistorySchema>) {
    const { shelterId, supplyId, ...rest } =
      CreateSupplyHistorySchema.parse(body);

    const prev = await this.prismaService.supplyHistory.findFirst({
      where: {
        shelterId,
        supplyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.prismaService.supplyHistory.create({
      data: {
        shelterId,
        supplyId,
        ...rest,
        createdAt: new Date().toISOString(),
        predecessorId: prev?.id,
      },
    });
  }
}
