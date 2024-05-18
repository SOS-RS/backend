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

const defaultTagsData: ShelterTagInfo = {
  NeedDonations: 10,
  NeedVolunteers: 10,
  RemainingSupplies: 10,
};

class ShelterSearch {
  private formProps: Partial<ShelterSearchProps>;
  private prismaService: PrismaService;

  constructor(
    prismaService: PrismaService,
    props: Partial<ShelterSearchProps> = {},
  ) {
    this.prismaService = prismaService;
    this.formProps = { ...props };
    this.getQuery = this.getQuery.bind(this);
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

  async getSearch(): Promise<Prisma.ShelterWhereInput> {
    if (!this.formProps.search) return {};

    const search = `${this.formProps.search.toLowerCase()}`;

    const results = await this.prismaService.$queryRaw<{ id: string }[]>(
      Prisma.sql`SELECT id FROM shelters WHERE lower(unaccent(address)) LIKE '%' || unaccent(${search}) || '%' OR lower(unaccent(name)) LIKE '%' || unaccent(${search}) || '%';`,
    );

    return {
      id: {
        in: results.map((r) => r.id),
      },
    };
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

  async getQuery(): Promise<Prisma.ShelterWhereInput> {
    if (Object.keys(this.formProps).length === 0) return {};

    const search = await this.getSearch();
    const queryData = {
      AND: [
        this.cities,
        this.geolocation,
        search,
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
    ...defaultTagsData,
    ...(tagProps?.tags ?? {}),
  };

  const parsed = results.map((result) => {
    const qtd: Required<ShelterTagInfo> = {
      NeedDonations: 0,
      NeedVolunteers: 0,
      RemainingSupplies: 0,
    };
    return {
      ...result,
      shelterSupplies: result.shelterSupplies.reduce((prev, shelterSupply) => {
        const supplyTags: ShelterTagType[] = [];
        let tagged: boolean = false;
        if (
          tags.NeedDonations &&
          [SupplyPriority.Needing, SupplyPriority.Urgent].includes(
            shelterSupply.priority,
          )
        ) {
          if (qtd.NeedDonations < tags.NeedDonations) {
            qtd.NeedDonations++;
            tagged = true;
            supplyTags.push('NeedDonations');
          }
        }
        if (
          tags.NeedVolunteers &&
          voluntaryIds.includes(shelterSupply.supply.supplyCategoryId) &&
          [SupplyPriority.Urgent, SupplyPriority.Needing].includes(
            shelterSupply.priority,
          )
        ) {
          if (qtd.NeedVolunteers < tags.NeedVolunteers) {
            qtd.NeedVolunteers++;
            tagged = true;
            supplyTags.push('NeedVolunteers');
          }
        }
        if (
          tags.RemainingSupplies &&
          [SupplyPriority.Remaining].includes(shelterSupply.priority)
        ) {
          if (qtd.RemainingSupplies < tags.RemainingSupplies) {
            qtd.RemainingSupplies++;
            tagged = true;
            supplyTags.push('RemainingSupplies');
          }
        }
        if (tagged) return [...prev, { ...shelterSupply, tags: supplyTags }];
        else return prev;
      }, [] as any),
    };
  });
  return parsed;
}

export { ShelterSearch, parseTagResponse };
