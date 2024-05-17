import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CreateTransportManagerSchema } from './types';

@Injectable()
export class TransportManagersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateTransportManagerSchema>) {
    const { transportId, userId } = CreateTransportManagerSchema.parse(body);

    let result = await this.prismaService.transport.findFirst({
      where: {
        id: transportId,
      },
      select: {
        id: true,
      },
    });
    if (!result) throw new NotFoundException('Transporte não encontrado.');

    result = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });
    if (!result) throw new NotFoundException('Usuário não encontrado.');

    await this.prismaService.transportManager.create({
      data: {
        transportId,
        userId,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
