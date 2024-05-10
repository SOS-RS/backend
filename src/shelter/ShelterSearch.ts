import { Prisma } from '@prisma/client';

import { IFilterFormProps } from './types';
import { PrismaService } from '../prisma/prisma.service';

class ShelterSearch {
  private data: IFilterFormProps;
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService, props: IFilterFormProps) {
    this.data = props;
    this.prismaService = prismaService;
  }

  get priority(): Prisma.ShelterWhereInput[] {
    if (this.data.priority) {
      return [
        {
          shelterSupplies: {
            some: {
              priority: +this.data.priority,
            },
          },
        },
      ];
    }
    return [];
  }

  get shelterStatus(): Prisma.ShelterWhereInput[] {
    if (!this.data.shelterStatus) return [];
    else {
      return this.data.shelterStatus.map((status) => {
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

  get supplyCategoryIds(): Prisma.ShelterWhereInput {
    if (!this.data.supplyCategoryIds) return {};
    return {
      shelterSupplies: {
        some: {
          supply: {
            supplyCategoryId: {
              in: this.data.supplyCategoryIds,
            },
          },
        },
      },
    };
  }

  get supplyIds(): Prisma.ShelterWhereInput {
    if (!this.data.supplyIds) return {};
    return {
      shelterSupplies: {
        some: {
          supply: {
            id: {
              in: this.data.supplyIds,
            },
          },
        },
      },
    };
  }

  get search(): Prisma.ShelterWhereInput[] {
    if (!this.data.search) return [];
    else
      return [
        {
          address: {
            contains: this.data.search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: this.data.search,
            mode: 'insensitive',
          },
        },
      ];
  }

  get query(): Prisma.ShelterWhereInput {
    if (Object.keys(this.data).length === 0) return {};
    const queryData = {
      AND: [
        { OR: this.search },
        { OR: this.shelterStatus },
        { OR: this.priority },
        this.supplyCategoryIds,
        this.supplyIds,
      ],
    };
    console.log(JSON.stringify(queryData, null, 2));
    return queryData;
  }
}

export { ShelterSearch };
