import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import {
  CreateShelterSchema,
  FullUpdateShelterSchema,
  UpdateShelterSchema,
} from './types';
import { SeachQueryProps } from '@/decorators/search-query/types';

@Injectable()
export class ShelterService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateShelterSchema>) {
    const payload = CreateShelterSchema.parse(body);
    await this.prismaService.shelter.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateShelterSchema>) {
    const payload = UpdateShelterSchema.parse(body);
    await this.prismaService.shelter.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async fullUpdate(id: string, body: z.infer<typeof FullUpdateShelterSchema>) {
    const payload = FullUpdateShelterSchema.parse(body);
    await this.prismaService.shelter.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async index(props: SeachQueryProps) {
    const { handleSearch } = props;
    return await handleSearch<Prisma.ShelterSelect<DefaultArgs>>(
      this.prismaService.shelter,
      {
        select: {
          id: true,
          name: true,
          pix: true,
          address: true,
          capacity: true,
          contact: true,
          petFriendly: true,
          shelteredPeople: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    );
  }
}
