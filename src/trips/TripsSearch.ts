import { Prisma } from '@prisma/client';
import { TripSearchProps } from './types/search.types';

class TripsSearch {
  private formProps: Partial<TripSearchProps>;

  constructor(props: Partial<TripSearchProps> = {}) {
    this.formProps = { ...props };
  }

  get departureCity(): Prisma.TripWhereInput {
    if (!this.formProps.departureCity) return {};

    return {
      departureCity: {
        contains: this.formProps.departureCity,
        mode: 'insensitive',
      },
    };
  }

  get departureDatetime(): Prisma.TripWhereInput {
    if (!this.formProps.departureDatetime) return {};

    return {
      departureDatetime: this.formProps.departureDatetime, //
    };
  }

  get transportId(): Prisma.TripWhereInput {
    if (!this.formProps.transportId) return {};

    return {
      transportId: this.formProps.transportId,
    };
  }

  get userId(): Prisma.TripWhereInput {
    if (!this.formProps.userId) return {};

    return {
      transport: {
        transportManagers: {
          some: {
            userId: this.formProps.userId,
          },
        },
      },
    };
  }

  get shelterIds(): Prisma.TripWhereInput {
    if (!this.formProps.shelterIds) return {};

    return {
      shelterId: {
        in: this.formProps.shelterIds,
      },
    };
  }

  get query(): Prisma.TripWhereInput {
    if (Object.keys(this.formProps).length === 0) return {};

    const queryData = {
      AND: [
        this.departureCity,
        this.departureDatetime,
        this.transportId,
        this.shelterIds,
        this.userId,
      ],
    };

    return queryData;
  }
}

export { TripsSearch };
