import { Prisma } from '@prisma/client';
import { TransportSearchProps } from './types/search.types';

class TransportsSearch {
  private formProps: Partial<TransportSearchProps>;

  constructor(props: Partial<TransportSearchProps> = {}) {
    this.formProps = { ...props };
  }

  get vehicleType(): Prisma.TransportWhereInput {
    if (!this.formProps.vehicleType) return {};

    return {
      vehicleType: {
        contains: this.formProps.vehicleType,
        mode: 'insensitive',
      },
    };
  }

  get vehicleRegistrationPlate(): Prisma.TransportWhereInput {
    if (!this.formProps.vehicleRegistrationPlate) return {};

    return {
      vehicleRegistrationPlate: {
        contains: this.formProps.vehicleRegistrationPlate,
        mode: 'insensitive',
      },
    };
  }

  get userId(): Prisma.TransportWhereInput {
    if (!this.formProps.userId) return {};

    return {
      transportManagers: {
        some: {
          userId: this.formProps.userId,
        },
      },
    };
  }

  get tripId(): Prisma.TransportWhereInput {
    if (!this.formProps.tripId) return {};

    return {
      trips: {
        some: {
          id: this.formProps.tripId,
        },
      },
    };
  }

  get query(): Prisma.TransportWhereInput {
    if (Object.keys(this.formProps).length === 0) return {};

    const queryData = {
      AND: [
        this.vehicleType,
        this.vehicleRegistrationPlate,
        this.userId,
        this.tripId,
      ],
    };

    return queryData;
  }
}

export { TransportsSearch };
