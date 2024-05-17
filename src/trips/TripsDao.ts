import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class TripsDao {
  constructor(private readonly prismaService: PrismaService) {}

  async checkIfUserManagesTransport(transportId: string, userId: string) {
    const result = await this.prismaService.transportManager.findFirst({
      where: {
        userId,
        transport: {
          id: transportId,
        },
      },
      select: {
        transportId: true,
      },
    });
    if (!result) throw new NotFoundException('Transporte não encontrado.');
  }

  async checkIfShelterExists(shelterId: string) {
    const result = await this.prismaService.shelter.findFirst({
      where: {
        id: shelterId,
      },
      select: {
        id: true,
      },
    });
    if (!result) throw new NotFoundException('Abrigo não encontrado.');
  }

  async create(payload: any) {
    await this.prismaService.trip.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async udpateOnlyIfUserManagesTrip(
    tripId: string,
    userId: string,
    payload: any,
  ) {
    try {
      await this.prismaService.trip.update({
        where: {
          id: tripId,
          canceled: false,
          transport: {
            transportManagers: {
              some: {
                userId,
              },
            },
          },
        },
        data: {
          ...payload,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw new NotFoundException('Viagem não encontrada.');
    }
  }
}
