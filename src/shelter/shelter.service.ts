import { z } from 'zod';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShelterSchema,
  FullUpdateShelterSchema,
  UpdateShelterSchema,
} from './types';
import { SeachQueryProps } from '@/decorators/search-query/types';
import { defaultSupplies } from './default';
import { SupplyPriority } from 'src/supply/types';

@Injectable()
export class ShelterService {
  private logger = new Logger(ShelterService.name);
  private static suplyCategoryIds: Map<string, string> = new Map<
    string,
    string
  >();

  constructor(private readonly prismaService: PrismaService) {
    this.loadSupplyCategories();
  }

  private loadSupplyCategories() {
    const fn = async () => {
      this.logger.log('Loading supply categories...');

      const categories: Set<string> = new Set<string>(
        defaultSupplies.map((s) => s.category),
      );

      await this.prismaService.supplyCategory.createMany({
        skipDuplicates: true,
        data: defaultSupplies.map((s) => ({
          name: s.category,
          supplyCategoryId: ShelterService.suplyCategoryIds.get(s.name),
          createdAt: new Date().toISOString(),
        })),
      });

      const supplyCategories = await this.prismaService.supplyCategory.findMany(
        {
          where: {
            name: {
              in: Array.from(categories),
            },
          },
          select: {
            id: true,
            name: true,
          },
        },
      );

      supplyCategories.forEach((s) => {
        ShelterService.suplyCategoryIds.set(s.name, s.id);
      });

      this.logger.log('Successfully loaded supply categories');
    };

    fn().catch((err) => {
      this.logger.error(`Failed to load default supply categories: ${err}`);
    });
  }

  async store(body: z.infer<typeof CreateShelterSchema>) {
    const payload = CreateShelterSchema.parse(body);

    await this.prismaService.shelter.create({
      data: {
        ...payload,
        supplies: {
          createMany: {
            skipDuplicates: true,
            data: defaultSupplies.map((s) => ({
              name: s.name,
              supplyCategoryId: ShelterService.suplyCategoryIds.get(
                s.category,
              )!,
              createdAt: new Date().toISOString(),
            })),
          },
        },
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

  async show(id: string) {
    const data = await this.prismaService.shelter.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        pix: true,
        shelteredPeople: true,
        capacity: true,
        contact: true,
        petFriendly: true,
        prioritySum: true,
        latitude: true,
        longitude: true,
        supplies: {
          select: {
            id: true,
            name: true,
            priority: true,
            supplyCategory: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return data;
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
          prioritySum: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          supplies: {
            where: {
              priority: {
                gte: SupplyPriority.Needing,
              },
            },
            take: 10,
            select: {
              name: true,
              priority: true,
            },
            orderBy: {
              priority: 'desc',
            },
          },
        },
      },
    );
  }
}
