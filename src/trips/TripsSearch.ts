import { Prisma } from '@prisma/client';
import { TripSearchProps } from './types/search.types';
import { State } from 'src/types';

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

  get departureState(): Prisma.TripWhereInput {
    if (!this.formProps.departureState) return {};

    return {
      departureState: State.parse(this.formProps.departureState),
    };
  }

  get departureDatetimeStart(): Prisma.TripWhereInput {
    if (!this.formProps.departureDatetimeStart) return {};

    return {
      departureDatetime: {
        gte: new Date(this.formProps.departureDatetimeStart),
      },
    };
  }

  get departureDatetimeEnd(): Prisma.TripWhereInput {
    if (!this.formProps.departureDatetimeEnd) return {};

    return {
      departureDatetime: {
        lte: new Date(this.formProps.departureDatetimeEnd),
      },
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
        this.departureState,
        this.departureDatetimeStart,
        this.departureDatetimeEnd,
        this.transportId,
        this.shelterIds,
        this.userId,
      ],
    };

    return queryData;
  }
}

export { TripsSearch };
