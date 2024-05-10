import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as qs from 'qs';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShelterSchema,
  FullUpdateShelterSchema,
  IFilterFormProps,
  UpdateShelterSchema,
} from './types';
import { SearchSchema } from '../types';
import { ShelterSearch } from './ShelterSearch';
import { SupplyPriority } from 'src/supply/types';

@Injectable()
export class ShelterService {
  constructor(private readonly prismaService: PrismaService) {}

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
        verified: true,
        shelterSupplies: {
          where: {
            priority: {},
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

  async index(query: any) {
    const {
      order,
      orderBy,
      page,
      perPage,
      search: searchQuery,
    } = SearchSchema.parse(query);
    const queryData = qs.parse(searchQuery) as unknown as IFilterFormProps;
    const { priority, search, shelterStatus, supplyCategoryIds, supplyIds } =
      queryData;
    const shelterSearch = new ShelterSearch(queryData);
    const where: Prisma.ShelterWhereInput = {
      OR: [
        {
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        ...shelterSearch.priority,
        ...shelterSearch.shelterStatus,
      ],
    };

    const count = await this.prismaService.shelter.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.shelter.findMany({
      ...whereData,
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
        verified: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        shelterSupplies: {
          where: {
            priority: {
              gt: SupplyPriority.UnderControl,
            },
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
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return { page, perPage, count, results };
  }
}
