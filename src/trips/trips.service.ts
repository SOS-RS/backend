import { Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import { CreateTripSchema, UpdateTripSchema } from './types/types';
import { TripsDao } from './TripsDao';
import { PrismaService } from 'src/prisma/prisma.service';
import { TripSearchPropsSchema } from './types/search.types';
import { TripsSearch } from './TripsSearch';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as qs from 'qs';

@Injectable()
export class TripsService {
  private readonly prismaService: PrismaService;
  private readonly tripsDao: TripsDao;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
    this.tripsDao = new TripsDao(prismaService);
  }

  async index(query: any) {
    const { order, orderBy, page, perPage, ...queryData } =
      TripSearchPropsSchema.parse(qs.parse(query));

    const { query: where } = new TripsSearch(queryData);
    const count = await this.prismaService.trip.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.TripFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.trip.findMany({
      ...whereData,
      include: {
        transport: true,
        shelter: true,
      },
    });

    return {
      page,
      perPage,
      count,
      results,
    };
  }

  async show(id: string) {
    const result = await this.prismaService.trip.findFirst({
      where: {
        id,
      },
      include: {
        transport: true,
        shelter: true,
      },
    });
    if (!result) throw new NotFoundException('Viagem não encontrada.');
    return result;
  }

  async getCities() {
    const cities = await this.prismaService.trip.groupBy({
      by: ['departureCity'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return cities.map(({ departureCity, _count: { id: tripsCount } }) => ({
      departureCity: departureCity || 'Cidade não informada',
      tripsCount,
    }));
  }

  async getStates() {
    const states = await this.prismaService.trip.groupBy({
      by: ['departureState'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return states.map(({ departureState, _count: { id: tripsCount } }) => ({
      departureState: departureState || 'Estado não informado',
      tripsCount,
    }));
  }

  async store(body: z.infer<typeof CreateTripSchema>, userId: string) {
    const payload = CreateTripSchema.parse(body);
    await this.tripsDao.checkIfUserManagesTransport(
      payload.transportId,
      userId,
    );
    await this.tripsDao.checkIfShelterExists(payload.shelterId);
    await this.tripsDao.create(payload);
  }

  async update(
    id: string,
    body: z.infer<typeof UpdateTripSchema>,
    userId: string,
  ) {
    const payload = UpdateTripSchema.parse(body);
    if (payload.shelterId) {
      await this.tripsDao.checkIfShelterExists(payload.shelterId);
    }
    await this.tripsDao.udpateOnlyIfUserManagesTrip(id, userId, payload);
  }

  async cancel(id: string, userId: string) {
    const payload = { canceled: true };
    await this.tripsDao.udpateOnlyIfUserManagesTrip(id, userId, payload);
  }
}
