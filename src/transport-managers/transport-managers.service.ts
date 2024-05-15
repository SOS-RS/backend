import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CreateTransportManagerSchema } from './types';

@Injectable()
export class TransportManagersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateTransportManagerSchema>) {
    const { transportId, userId } = CreateTransportManagerSchema.parse(body);

    await this.prismaService.transport.findFirstOrThrow({
      where: {
        id: transportId,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.transportManager.create({
      data: {
        transportId,
        userId,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
