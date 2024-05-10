import z from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSupplySchema,
  SupplySearchSchema,
  UpdateSupplySchema,
} from './types';

@Injectable()
export class SupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateSupplySchema>) {
    const payload = CreateSupplySchema.parse(body);
    return await this.prismaService.supply.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateSupplySchema>) {
    const payload = UpdateSupplySchema.parse(body);
    await this.prismaService.supply.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async index() {
    const data = await this.prismaService.supply.findMany({
      distinct: ['name', 'supplyCategoryId'],
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
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

  async top(body: z.infer<typeof SupplySearchSchema>) {
    const payload = SupplySearchSchema.parse(body);
    const take = payload.perPage;
    const skip = payload.perPage * (payload.page - 1);

    const data = await this.prismaService.supply.groupBy({
      by: ['name'],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: 'desc',
        },
      },
      take,
      skip,
    });

    return data.map((row) => ({ name: row.name, amount: row._count.name }));
  }
}
