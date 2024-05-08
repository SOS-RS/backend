import { z } from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateShelterSupplySchema, UpdateShelterSupplySchema } from './types';

@Injectable()
export class ShelterSupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateShelterSupplySchema>) {
    const payload = CreateShelterSupplySchema.parse(body);
    await this.prismaService.shelterSupply.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(body: z.infer<typeof UpdateShelterSupplySchema>) {
    const { data, where } = UpdateShelterSupplySchema.parse(body);
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
            priority: true,
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
