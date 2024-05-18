import { Prisma } from '@prisma/client';

import { calculateGeolocationBounds } from '@/utils/utils';
import { SupplyPriority } from 'src/supply/types';
import { PrismaService } from '../prisma/prisma.service';
import {
  SearchShelterTagResponse,
  ShelterSearchProps,
  ShelterStatus,
  ShelterTagInfo,
  ShelterTagType,
} from './types/search.types';

class ShelterSearch {
  private formProps: Partial<ShelterSearchProps>;
  private prismaService: PrismaService;

  constructor(
    prismaService: PrismaService,
    props: Partial<ShelterSearchProps> = {},
  ) {
    this.prismaService = prismaService;
    this.formProps = { ...props };
  }

  priority(supplyIds: string[] = []): Prisma.ShelterWhereInput {
    if (!this.formProps.priority) return {};

    return {
      shelterSupplies: {
        some: {
          priority: +this.formProps.priority,
          supplyId:
            supplyIds.length > 0
              ? {
                  in: supplyIds,
                }
              : undefined,
        },
      },
    };
  }

  get shelterStatus(): Prisma.ShelterWhereInput[] {
    if (!this.formProps.shelterStatus) return [];

    const clausesFromStatus: Record<
      ShelterStatus,
      Prisma.ShelterWhereInput['capacity'] | null
    > = {
      waiting: null,
      available: {
        gt: this.prismaService.shelter.fields.shelteredPeople,
      },
      unavailable: {
        lte: this.prismaService.shelter.fields.shelteredPeople,
        not: 0,
      },
    };

    return this.formProps.shelterStatus.map((status) => ({
      capacity: clausesFromStatus[status],
    }));
  }

  supplyCategoryIds(
    priority?: SupplyPriority | null,
  ): Prisma.ShelterWhereInput {
    if (!this.formProps.supplyCategoryIds) return {};
    return {
      shelterSupplies: {
        some: {
          priority: priority ? +priority : undefined,
          supply: {
            supplyCategoryId: {
              in: this.formProps.supplyCategoryIds,
            },
          },
        },
      },
    };
  }

  get supplyIds(): Prisma.ShelterWhereInput {
    if (!this.formProps.supplyIds) return {};
    return {
      shelterSupplies: {
        some: {
          supply: {
            id: {
              in: this.formProps.supplyIds,
            },
          },
        },
      },
    };
  }

  get search(): Prisma.ShelterWhereInput[] {
    if (!this.formProps.search) return [];

    return [
      {
        address: {
          contains: this.formProps.search,
          mode: 'insensitive',
        },
      },
      {
        name: {
          contains: this.formProps.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  get cities(): Prisma.ShelterWhereInput {
    if (!this.formProps.cities) return {};

    return {
      city: {
        in: this.formProps.cities,
      },
    };
  }

  get geolocation(): Prisma.ShelterWhereInput {
    if (!this.formProps.geolocation) return {};

    const { minLat, maxLat, minLong, maxLong } = calculateGeolocationBounds(
      this.formProps.geolocation,
    );

    return {
      latitude: {
        gte: minLat,
        lte: maxLat,
      },
      longitude: {
        gte: minLong,
        lte: maxLong,
      },
    };
  }

  get query(): Prisma.ShelterWhereInput {
    if (Object.keys(this.formProps).length === 0) return {};
    const queryData = {
      AND: [
        this.cities,
        this.geolocation,
        { OR: this.search },
        { OR: this.shelterStatus },
        this.priority(this.formProps.supplyIds),
        this.supplyCategoryIds(this.formProps.priority),
      ],
    };

    return queryData;
  }
}

/**
 *
 * @param formProps Uma interface do tipo ShelterTagInfo | null. Que indica a quantidade máxima de cada categoria deverá ser retornada
 * @param results Resultado da query em `this.prismaService.shelter.findMany`
 * @param voluntaryIds
 * @returns Retorna a lista de resultados, adicionando o campo tags em cada supply para assim categoriza-los corretamente e limitar a quantidade de cada retornada respeitando os parametros em formProps
 */
function parseTagResponse(
  tagProps: Partial<Pick<ShelterSearchProps, 'tags'>> = {},
  results: SearchShelterTagResponse[],
  voluntaryIds: string[],
): SearchShelterTagResponse[] {
  const tags: ShelterTagInfo = {
    ...(tagProps?.tags ?? {}),
  };

  const parsed = results.map((result) => {
    return {
      ...result,
      shelterSupplies: result.shelterSupplies.reduce((prev, shelterSupply) => {
        const supplyTags: ShelterTagType[] = [];
        if (
          tags.NeedDonations &&
          [SupplyPriority.Needing, SupplyPriority.Urgent].includes(
            shelterSupply.priority,
          )
        ) {
          supplyTags.push('NeedDonations');
        }
        if (
          tags.NeedVolunteers &&
          voluntaryIds.includes(shelterSupply.supply.supplyCategoryId) &&
          [SupplyPriority.Urgent, SupplyPriority.Needing].includes(
            shelterSupply.priority,
          )
        ) {
          supplyTags.push('NeedVolunteers');
        }
        if (
          tags.RemainingSupplies &&
          [SupplyPriority.Remaining].includes(shelterSupply.priority)
        ) {
          supplyTags.push('RemainingSupplies');
        }
        return [...prev, { ...shelterSupply, tags: supplyTags }];
      }, [] as any),
    };
  });
  return parsed;
}

export { ShelterSearch, parseTagResponse };
