import { z } from 'zod';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import {
  ComplexSearchSchema,
  CreateShelterSchema,
  FullUpdateShelterSchema,
  UpdateShelterSchema,
} from './types';
import { SeachQueryProps } from '@/decorators/search-query/types';

@Injectable()
export class ShelterService {
  private logger = new Logger(ShelterService.name);

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

    return await handleSearch<Prisma.ShelterSelect<DefaultArgs>>(
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
          verified: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
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
        },
      },
    );
  }

  unaccentString(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private async getUnaccentShelterIds(searchText: string) {
    if (!searchText) return [];
    const normalizedSearch = this.unaccentString(searchText);

    const parameterizedSearch = `%${normalizedSearch}%`;

    const idsFound = await this.prismaService.$queryRaw<{ id: string }[]>(
      Prisma.sql`SELECT id FROM shelters WHERE unaccent(name) ILIKE ${parameterizedSearch} OR unaccent(address) ILIKE ${parameterizedSearch};`,
    );
    return idsFound.map(({ id }) => id);
  }

  async search(props: z.infer<typeof ComplexSearchSchema>) {
    const payload = ComplexSearchSchema.parse({
      ...props,
      supplyCategories:
        typeof props['supplyCategories[]'] === 'string'
          ? [props['supplyCategories[]']]
          : props['supplyCategories[]'],
      supplies:
        typeof props['supplies[]'] === 'string'
          ? [props['supplies[]']]
          : props['supplies[]'],
    });

    const shelterStatusFilter = this.addShelterStatusFilter(payload);

    const unnaccentShelterIds = await this.getUnaccentShelterIds(
      payload.search,
    );

    if (payload.search && unnaccentShelterIds.length === 0) {
      return {
        perPage: payload.perPage,
        page: payload.page,
        count: 0,
        results: [],
      };
    }

    const where = await this.mountWhereFilter(payload, unnaccentShelterIds);
    const take = payload.perPage;
    const skip = payload.perPage * (payload.page - 1);

    if (shelterStatusFilter.length > 0) {
      where['AND'].push({
        OR: shelterStatusFilter,
      });
    }

    const count = await this.prismaService.shelter.count({
      where: where,
    });

    const results = await this.prismaService.shelter.findMany({
      where: where,
      orderBy: {
        prioritySum: 'desc',
      },
      take,
      skip,
      select: {
        id: true,
        name: true,
        pix: true,
        address: true,
        capacity: true,
        contact: true,
        verified: true,
        petFriendly: true,
        shelteredPeople: true,
        prioritySum: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
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
      },
    });
    return { perPage: payload.perPage, page: payload.page, count, results };
  }

  private async mountWhereFilter(
    payload: z.infer<typeof ComplexSearchSchema>,
    unnaccentShelterIds: string[] = [],
  ) {
    const andClauses: Prisma.ShelterWhereInput[] = [];

    if (unnaccentShelterIds.length > 0) {
      andClauses.push({
        id: { in: unnaccentShelterIds },
      });
    }

    const shelterSuppliesFilter = {
      shelterSupplies: {
        some: {},
      },
    };

    if (payload.priority) {
      shelterSuppliesFilter.shelterSupplies.some['priority'] = parseInt(
        payload.priority,
      );
    }

    if (payload?.supplyCategories && payload?.supplyCategories.length !== 0) {
      shelterSuppliesFilter.shelterSupplies.some['supply'] = {
        supplyCategoryId: {
          in: payload.supplyCategories,
        },
      };
    }

    if (payload?.supplies && payload?.supplies.length !== 0) {
      shelterSuppliesFilter.shelterSupplies.some['supplyId'] = {
        in: payload.supplies,
      };
    }

    if (Object.keys(shelterSuppliesFilter.shelterSupplies.some).length !== 0) {
      andClauses.push(shelterSuppliesFilter);
    }

    return {
      AND: andClauses,
    };
  }

  private addShelterStatusFilter(payload: z.infer<typeof ComplexSearchSchema>) {
    const shelterStatusFilter: any = [];

    if (payload.filterAvailableShelter) {
      shelterStatusFilter.push({
        AND: [
          {
            capacity: {
              gt: this.prismaService.shelter.fields.shelteredPeople,
            },
          },
          {
            capacity: { not: null },
          },
          {
            shelteredPeople: { not: null },
          },
        ],
      });
    }

    if (payload.filterUnavailableShelter) {
      shelterStatusFilter.push({
        AND: [
          {
            capacity: {
              lte: this.prismaService.shelter.fields.shelteredPeople,
            },
          },
          {
            capacity: { not: null },
          },
          {
            shelteredPeople: { not: null },
          },
        ],
      });
    }

    if (payload.waitingShelterAvailability) {
      shelterStatusFilter.push({
        capacity: null,
      });

      shelterStatusFilter.push({
        shelteredPeople: null,
      });
    }

    return shelterStatusFilter;
  }
}
