import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { AccessLevel, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationOrderScheme, UpdateDonationOrderScheme } from './types';
import { SearchSchema } from '../types';

@Injectable()
export class DonationOrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(shelterId: string, userId: string, query: any) {
    const { order, orderBy, page, perPage } = SearchSchema.parse(query);

    const where: Prisma.DonationOrderWhereInput = {
      shelterId,
      userId,
    };

    const isDistributionCenter = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        accessLevel: AccessLevel.DistributionCenter,
      },
    });
    if (isDistributionCenter) delete where.userId;

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

  async store(body: z.infer<typeof CreateDonationOrderScheme>) {
    const { supplies, ...rest } = CreateDonationOrderScheme.parse(body);
    await this.prismaService.donationOrder.create({
      data: {
        ...rest,
        createdAt: new Date().toString(),
        donationOrderSupplies: {
          createMany: {
            data: supplies.map((s) => ({
              supplyId: s.id,
              quantity: s.quantity,
              createdAt: new Date().toString(),
            })),
          },
        },
      },
    });
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
