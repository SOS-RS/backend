import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplySchema, UpdateSupplySchema } from './types';
import { CreateSupplyDTO } from './dtos/CreateSupplyDTO';
import { UpdateSupplyDTO } from './dtos/UpdateSupplyDTO';

@Injectable()
export class SupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: CreateSupplyDTO) {
    const payload = CreateSupplySchema.parse(body);
    return await this.prismaService.supply.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: UpdateSupplyDTO) {
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
}
