import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { SupplyPriority } from 'src/supply/types';
import {
  IFilterFormProps,
  SearchShelterTagResponse,
  ShelterTagInfo,
  ShelterTagType,
} from './types/search.types';

const defaultTagsData: ShelterTagInfo = {
  NeedDonations: 10,
  NeedVolunteers: 10,
  RemainingSupplies: 10,
};

class ShelterSearch {
  private formProps: Partial<IFilterFormProps>;
  private prismaService: PrismaService;

  constructor(
    prismaService: PrismaService,
    props: Partial<IFilterFormProps> = {},
  ) {
    this.prismaService = prismaService;
    this.formProps = { ...props };
  }

  priority(supplyIds: string[] = []): Prisma.ShelterWhereInput {
    if (this.formProps.priority) {
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
    } else return {};
  }

  get shelterStatus(): Prisma.ShelterWhereInput[] {
    if (!this.formProps.shelterStatus) return [];
    else {
      return this.formProps.shelterStatus.map((status) => {
        if (status === 'waiting')
          return {
            capacity: null,
          };
        else if (status === 'available')
          return {
            capacity: {
              gt: this.prismaService.shelter.fields.shelteredPeople,
            },
          };
        else
          return {
            capacity: {
              lte: this.prismaService.shelter.fields.shelteredPeople,
            },
          };
      });
    }
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
    else
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

  get query(): Prisma.ShelterWhereInput {
    if (Object.keys(this.formProps).length === 0) return {};
    const queryData = {
      AND: [
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
  tagProps: Partial<Pick<IFilterFormProps, 'tags'>> = {},
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
