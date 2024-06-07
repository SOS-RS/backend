import z from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplySchema, UpdateSupplySchema } from './types';

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

  async isDuplicate(body: z.infer<typeof CreateSupplySchema>):Promise<boolean> {

    function slugify(name: string | void):string {

      const slugName = String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
      .replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      return slugName
    }

    const existingData = await this.prismaService.supply.findFirst({
      select: {
        id: false,
        name: true,
        supplyCategory: {
          select: {
            id: true,
            name: false,
          },
        },
        createdAt: false,
        updatedAt: false,
      },
    });
    const existingDataName = slugify(existingData?.name)

    const payload = CreateSupplySchema.parse(body);
    const payloadName = slugify(payload.name)

    if (existingDataName === payloadName
      && payload.supplyCategoryId === existingData?.supplyCategory.id) {
      return true
    }

    return false;
  }
}
