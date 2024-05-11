import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShelteredPeopleSchema,
  FullUpdateShelteredPeopleSchema,
  UpdateShelteredPeopleSchema,
} from './types/types';
import { SearchSchema } from '../types';
import { ShelteredPeopleSearch } from './ShelteredPeopleSearch';
import { IFilterFormProps } from './types/search.types';

@Injectable()
export class ShelteredPeopleService {
  constructor(private readonly prismaService: PrismaService) {
    // Empty
  }

  async store(body: z.infer<typeof CreateShelteredPeopleSchema>) {
    const payload = CreateShelteredPeopleSchema.parse(body);

    await this.prismaService.shelteredPeople.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateShelteredPeopleSchema>) {
    const payload = UpdateShelteredPeopleSchema.parse(body);
    await this.prismaService.shelteredPeople.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async fullUpdate(
    id: string,
    body: z.infer<typeof FullUpdateShelteredPeopleSchema>,
  ) {
    const payload = FullUpdateShelteredPeopleSchema.parse(body);
    await this.prismaService.shelteredPeople.update({
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
    return this.prismaService.shelteredPeople.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        cpf: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async index(query: any) {
    const {
      order,
      orderBy,
      page,
      perPage,
      search: searchQuery,
    } = SearchSchema.parse(query);
    const queryData = qs.parse(searchQuery) as unknown as IFilterFormProps;
    const { query: where } = new ShelteredPeopleSearch(queryData);
    const count = await this.prismaService.shelteredPeople.count({ where });

    const take = perPage;
    const skip = perPage * (page - 1);

    const whereData: Prisma.ShelteredPeopleFindManyArgs<DefaultArgs> = {
      take,
      skip,
      orderBy: { [orderBy]: order },
      where,
    };

    const results = await this.prismaService.shelteredPeople.findMany({
      ...whereData,
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        cpf: true,
        phone: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      page,
      perPage,
      count,
      results: results,
    };
  }
}
