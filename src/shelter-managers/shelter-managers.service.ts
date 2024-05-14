import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateShelterManagerSchema } from './types';
import { CreateShelterManagerDTO } from './dtos/CreateShelterManagerDTO';

@Injectable()
export class ShelterManagersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: CreateShelterManagerDTO) {
    const { shelterId, userId } = CreateShelterManagerSchema.parse(body);
    await this.prismaService.shelterManagers.create({
      data: {
        shelterId,
        userId,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async index(shelterId: string, includes: string = 'user') {
    const includeData = {
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      shelter: {
        select: {
          id: true,
          name: true,
          contact: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    };

    const selectData = includes
      .split(',')
      .reduce(
        (prev, curr) =>
          includeData[curr] ? { ...prev, [curr]: includeData[curr] } : prev,
        {},
      );

    const data = await this.prismaService.shelterManagers.findMany({
      where: {
        shelterId,
      },
      select: { ...selectData, updatedAt: true, createdAt: true },
    });
    return data;
  }
}
