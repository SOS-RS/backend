import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, ShelterSupply } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { millisecondsToHours, subDays } from 'date-fns';
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
  IShelterSupplyDecay,
  UpdateShelterSchema,
} from './types/types';
import { registerSupplyLog } from '@/interceptors/interceptors/shelter-supply-history/utils';

@Injectable()
export class ShelterService implements OnModuleInit {
  private logger = new Logger(ShelterService.name);
  private voluntaryIds: string[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  onModuleInit() {
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
        contact: true,
        petFriendly: true,
        prioritySum: true,
        latitude: true,
        longitude: true,
        verified: true,
        actived: true,
        authorizedContact: true,
        category: true,
        shelterSupplies: {
          select: {
            priority: true,
            quantity: true,
            supplyId: true,
            shelterId: true,
            createdAt: true,
            updatedAt: true,
            supply: {
              select: {
                id: true,
                name: true,
                measure: true,
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

    if (data) {
      this.decayShelterSupply(data.shelterSupplies);

      if (!shouldShowContact && !data.authorizedContact) {
        data.contact = 'Não autorizado informar';
      } else if (shouldShowContact && !data.authorizedContact) {
        return data;
      }
    }

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
    const { getQuery } = new ShelterSearch(this.prismaService, queryData);
    const where = await getQuery();

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
        actived: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        contact: true,
        authorizedContact: true,
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

    this.decayShelterSupply(results.flatMap((r) => r.shelterSupplies));

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
      where: {
        city: {
          not: null,
        },
      },
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
      city,
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

  private parseShelterSupply(
    shelterSupply: ShelterSupply,
  ): IShelterSupplyDecay {
    return {
      shelterId: shelterSupply.shelterId,
      supplyId: shelterSupply.supplyId,
      priority: shelterSupply.priority,
      createdAt: new Date(shelterSupply.createdAt).getTime(),
      updatedAt: shelterSupply.updatedAt
        ? new Date(shelterSupply.updatedAt).getTime()
        : 0,
    };
  }

  private canDecayShelterSupply(
    shelterSupply: IShelterSupplyDecay,
    priorities: SupplyPriority[],
    timeInHoursToDecay: number,
  ): boolean {
    return (
      priorities.includes(shelterSupply.priority) &&
      millisecondsToHours(
        new Date().getTime() -
          Math.max(shelterSupply.createdAt, shelterSupply.updatedAt),
      ) > timeInHoursToDecay
    );
  }

  private async handleDecayShelterSupply(
    shelterSupplies: IShelterSupplyDecay[],
    newPriority: SupplyPriority,
  ) {
    const shelterIds: Set<string> = new Set();
    shelterSupplies.forEach((s) => shelterIds.add(s.shelterId));

    await this.prismaService.$transaction([
      this.prismaService.shelter.updateMany({
        where: {
          id: {
            in: Array.from(shelterIds),
          },
        },
        data: {
          updatedAt: new Date().toISOString(),
        },
      }),
      ...shelterSupplies.map((s) =>
        this.prismaService.shelterSupply.update({
          where: {
            shelterId_supplyId: {
              shelterId: s.shelterId,
              supplyId: s.supplyId,
            },
          },
          data: {
            priority: newPriority,
            updatedAt: new Date().toISOString(),
          },
        }),
      ),
    ]);

    shelterSupplies.forEach((s) => {
      registerSupplyLog({
        shelterId: s.shelterId,
        supplyId: s.supplyId,
        priority: newPriority,
      });
    });
  }

  private async decayShelterSupply(shelterSupplies: ShelterSupply[]) {
    this.handleDecayShelterSupply(
      shelterSupplies
        .map(this.parseShelterSupply)
        .filter((f) =>
          this.canDecayShelterSupply(f, [SupplyPriority.Urgent], 48),
        ),

      SupplyPriority.Needing,
    );

    this.handleDecayShelterSupply(
      shelterSupplies
        .map(this.parseShelterSupply)
        .filter((f) =>
          this.canDecayShelterSupply(
            f,
            [SupplyPriority.Needing, SupplyPriority.Remaining],
            72,
          ),
        ),
      SupplyPriority.UnderControl,
    );
  }
}
