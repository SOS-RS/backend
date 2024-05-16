import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CreateTripSchema, UpdateTripSchema } from './types';
import { TripsDao } from './TripsDao';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TripsService {
  private readonly prismaService: PrismaService;
  private readonly tripsDao: TripsDao;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
    this.tripsDao = new TripsDao(prismaService);
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
    if (!result) throw new Error('Viagem não encontrada.');
    return result;
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
