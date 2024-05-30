import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationOrderScheme, UpdateDonationOrderScheme } from './types';
import { SearchSchema } from '../types';

@Injectable()
export class DonationOrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(userId: string, query: any) {
    const { shelterId } = query;
    const { order, orderBy, page, perPage } = SearchSchema.parse(query);

    const where: Prisma.DonationOrderWhereInput = {
      shelterId,
      userId,
    };

    const count = await this.prismaService.donationOrder.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.DonationOrderFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.donationOrder.findMany({
      ...whereData,
      select: {
        id: true,
        status: true,
        userId: true,
        shelter: {
          select: {
            id: true,
            name: true,
          },
        },
        donationOrderSupplies: {
          select: {
            quantity: true,
            supply: {
              select: {
                name: true,
                measure: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      page,
      perPage,
      count,
      results,
    };
  }

  async show(id: string, userId: string) {
    const data = await this.prismaService.donationOrder.findUnique({
      where: { id, userId },
      select: {
        id: true,
        status: true,
        userId: true,
        shelter: {
          select: {
            id: true,
            name: true,
          },
        },
        donationOrderSupplies: {
          select: {
            quantity: true,
            supply: {
              select: {
                name: true,
                measure: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }

  async store(body: z.infer<typeof CreateDonationOrderScheme>) {
    const { supplies, shelterId, userId } =
      CreateDonationOrderScheme.parse(body);
    const donation = await this.prismaService.donationOrder.create({
      data: {
        shelterId,
        userId,
        createdAt: new Date().toISOString(),
        donationOrderSupplies: {
          createMany: {
            data: supplies.map((s) => ({
              supplyId: s.id,
              quantity: s.quantity,
              createdAt: new Date().toISOString(),
            })),
          },
        },
      },
    });

    return donation;
  }

  async update(
    orderId: string,
    body: z.infer<typeof UpdateDonationOrderScheme>,
  ) {
    const { status } = UpdateDonationOrderScheme.parse(body);
    await this.prismaService.donationOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
