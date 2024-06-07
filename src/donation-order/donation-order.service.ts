import { z } from 'zod';
import { HttpException, Injectable } from '@nestjs/common';
import { DonationOrderStatus, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationOrderScheme, UpdateDonationOrderScheme } from './types';
import { SearchSchema } from '../types';

@Injectable()
export class DonationOrderService {
  private donationOrderVisibleFields: Prisma.DonationOrderSelect = {
    id: true,
    status: true,
    user: {
      select: {
        id: true,
        name: true,
        lastName: true,
        phone: true,
      },
    },
    shelter: {
      select: {
        id: true,
        name: true,
        address: true,
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
  };

  constructor(private readonly prismaService: PrismaService) {}

  async index(userId: string, query: any) {
    const { shelterId, op } = query;
    const { order, orderBy, page, perPage } = SearchSchema.parse(query);

    let where = {};

    if (op === 'received') {
      where = await this.getAllReceivedDonations(userId);
    } else {
      where = this.getAllDonationsMade(userId, shelterId);
    }

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
      select: this.donationOrderVisibleFields,
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
      select: this.donationOrderVisibleFields,
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
    userId: string,
    body: z.infer<typeof UpdateDonationOrderScheme>,
  ) {
    const { status } = UpdateDonationOrderScheme.parse(body);
    const order = await this.prismaService.donationOrder.findFirst({
      where: { id: orderId },
      select: {
        shelterId: true,
        userId: true,
        donationOrderSupplies: true,
      },
    });

    if (!order) return new HttpException('Donation not found', 404);

    if (order.userId !== userId) {
      const isEmployer = await this.prismaService.shelterUsers.findFirst({
        where: {
          userId,
          shelterId: order.shelterId,
        },
      });

      if (!isEmployer)
        return new HttpException(
          'User not allowed to update this donation',
          404,
        );
    }

    const updatePromises =
      status === DonationOrderStatus.Complete
        ? order.donationOrderSupplies.map((d) =>
            this.prismaService.shelterSupply.update({
              where: {
                shelterId_supplyId: {
                  shelterId: order.shelterId,
                  supplyId: d.supplyId,
                },
              },
              data: {
                quantity: {
                  decrement: d.quantity,
                },
              },
            }),
          )
        : [];

    await this.prismaService.$transaction([
      ...updatePromises,
      this.prismaService.donationOrder.update({
        where: {
          id: orderId,
        },
        data: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }),
    ]);
  }

  private async getAllReceivedDonations(userId: string, shelterId?: string) {
    const where: Prisma.DonationOrderWhereInput = {
      shelterId,
    };

    if (!shelterId) {
      const sheltersByUser = await this.prismaService.shelterUsers.findMany({
        where: {
          userId,
        },
        select: {
          shelterId: true,
        },
      });

      const shelterIds = sheltersByUser.map((s) => s.shelterId);
      where.shelterId = {
        in: shelterIds,
      };
    }

    return where;
  }

  private getAllDonationsMade(userId: string, shelterId?: string) {
    const where: Prisma.DonationOrderWhereInput = {
      userId,
      shelterId,
    };

    return where;
  }
}
