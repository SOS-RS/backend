import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { SeachQueryProps } from '@/decorators/search-query/types';
import { PrismaService } from '../prisma/prisma.service';
import { ShelterSupplyService } from '../shelter-supply/shelter-supply.service';
import { SupplyPriority } from '../supply/types';
import {
  CreateShelterSchema,
  FullUpdateShelterSchema,
  UpdateShelterSchema,
} from './types';

@Injectable()
export class ShelterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shelterSupplyService: ShelterSupplyService,
  ) {}

  async store(body: z.infer<typeof CreateShelterSchema>) {
    const payload = CreateShelterSchema.parse(body);

    await this.prismaService.shelter.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateShelterSchema>) {
    const payload = UpdateShelterSchema.parse(body);
    await this.prismaService.shelter.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async fullUpdate(id: string, body: z.infer<typeof FullUpdateShelterSchema>) {
    const payload = FullUpdateShelterSchema.parse(body);
    await this.prismaService.shelter.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async show(id: string) {
    const data = await this.prismaService.shelter.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        pix: true,
        shelteredPeople: true,
        capacity: true,
        contact: true,
        petFriendly: true,
        prioritySum: true,
        latitude: true,
        longitude: true,
        shelterSupplies: {
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
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return data;
  }

  async index(props: SeachQueryProps) {
    const { handleSearch } = props;

    const partialResult = await handleSearch<Prisma.ShelterSelect<DefaultArgs>>(
      this.prismaService.shelter,
      {
        select: {
          id: true,
          shelterSupplies: {
            where: {
              priority: {
                gte: SupplyPriority.Urgent,
              },
            },
            take: 10,
            select: {
              priority: true,
              supply: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    );

    await this.shelterSupplyService.checkAndUpdateOutdatedPriorities(
      partialResult.results.flatMap((r) =>
        r.shelterSupplies.map((s) => ({ ...s, shelterId: r.id })),
      ),
    );

    const result = await handleSearch<Prisma.ShelterSelect<DefaultArgs>>(
      this.prismaService.shelter,
      {
        select: {
          id: true,
          name: true,
          pix: true,
          address: true,
          capacity: true,
          contact: true,
          petFriendly: true,
          shelteredPeople: true,
          prioritySum: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          shelterSupplies: {
            where: {
              priority: {
                gte: SupplyPriority.Needing,
              },
            },
            take: 10,
            select: {
              priority: true,
              supply: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              priority: 'desc',
            },
          },
        },
      },
    );

    return result;
  }
}
