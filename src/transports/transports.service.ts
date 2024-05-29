import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CreateTransportSchema, UpdateTransportSchema } from './types/types';
import { TransportSearchPropsSchema } from './types/search.types';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { TransportsSearch } from './TransportsSearch';

@Injectable()
export class TransportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(query: any) {
    const { order, orderBy, page, perPage, ...queryData } =
      TransportSearchPropsSchema.parse(query);

    const { query: where } = new TransportsSearch(queryData);
    const count = await this.prismaService.transport.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.TransportFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.transport.findMany({
      ...whereData,
    });

    return {
      page,
      perPage,
      count,
      results,
    };
  }

  async show(id: string) {
    const result = await this.prismaService.transport.findFirst({
      where: {
        id,
      },
    });
    if (!result) throw new NotFoundException('Transporte não encontrado.');
    return result;
  }

  async store(body: z.infer<typeof CreateTransportSchema>) {
    const payload = CreateTransportSchema.parse(body);

    await this.prismaService.transport.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateTransportSchema>) {
    const payload = UpdateTransportSchema.parse(body);
    await this.prismaService.transport.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
