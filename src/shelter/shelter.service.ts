import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as qs from 'qs';
import { z } from 'zod';

import { PrismaService } from '../prisma/prisma.service';
import { SupplyPriority } from '../supply/types';
import { SearchSchema } from '../types';
import { ShelterSearch, parseTagResponse } from './ShelterSearch';
import { ShelterSearchPropsSchema } from './types/search.types';
import {
  CreateShelterSchema,
  FullUpdateShelterSchema,
  UpdateShelterSchema,
} from './types/types';
import { subDays } from 'date-fns';

@Injectable()
export class ShelterService {
  private voluntaryIds: string[] = [];

  constructor(private readonly prismaService: PrismaService) {
    this.loadVoluntaryIds();
  }

  async store(body: z.infer<typeof CreateShelterSchema>) {
    const payload = CreateShelterSchema.parse(body);

    await this.prismaService.shelter.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: subDays(new Date(), 1).toISOString(),
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

  async show(id: string, shouldShowContact: boolean) {
    const data = await this.prismaService.shelter.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        street: true,
        neighbourhood: true,
        city: true,
        streetNumber: true,
        zipCode: true,
        pix: true,
        shelteredPeople: true,
        capacity: true,
        contact: shouldShowContact,
        petFriendly: true,
        prioritySum: true,
        latitude: true,
        longitude: true,
        verified: true,
        shelterSupplies: {
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
    const queryData = ShelterSearchPropsSchema.parse(qs.parse(searchQuery));
    const { query: where } = new ShelterSearch(this.prismaService, queryData);
    const count = await this.prismaService.shelter.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.ShelterFindManyArgs<DefaultArgs> = {
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
        street: true,
        neighbourhood: true,
        city: true,
        streetNumber: true,
        zipCode: true,
        capacity: true,
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
              notIn: [SupplyPriority.UnderControl],
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          include: {
            supply: true,
          },
        },
      },
    });

    const parsed = parseTagResponse(queryData, results, this.voluntaryIds);

    return {
      page,
      perPage,
      count,
      results: parsed,
    };
  }

  async getCities() {
    const cities = await this.prismaService.shelter.groupBy({
      by: ['city'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return cities.map(({ city, _count: { id: sheltersCount } }) => ({
      city: city || 'Cidade não informada',
      sheltersCount,
    }));
  }

  private loadVoluntaryIds() {
    this.prismaService.supplyCategory
      .findMany({
        where: {
          name: {
            in: ['Especialistas e Profissionais', 'Voluntariado'],
          },
        },
      })
      .then((resp) => {
        this.voluntaryIds.push(...resp.map((s) => s.id));
      });
  }
}
