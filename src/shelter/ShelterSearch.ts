import { Prisma } from '@prisma/client';
import { IFilterFormProps } from './types';

class ShelterSearch {
  private data: IFilterFormProps;

  constructor(props: IFilterFormProps) {
    this.data = props;
  }

  get priority(): Prisma.ShelterWhereInput[] {
    if (this.data.priority !== null) {
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
        else if (status === 'available') return {};
        else
          return {
            // capacity: {
            //   lte: Prisma.ShelterScalarFieldEnum.shelteredPeople,
            // },
          };
      });
    }
  }
}

export { ShelterSearch };
