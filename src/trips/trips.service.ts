import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CreateTripSchema } from './types';

@Injectable()
export class TripsService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateTripSchema>) {
    const payload = CreateTripSchema.parse(body);

    await this.prismaService.transport.findFirstOrThrow({
      where: {
        id: payload.transportId,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.shelter.findFirstOrThrow({
      where: {
        id: payload.shelterId,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.trip.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
