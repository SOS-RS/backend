import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import {
  CreateSupplyCategorySchema,
  UpdateSupplyCategorySchema,
} from './types';

import { slugify } from '@/utils/utils';

@Injectable()
export class SupplyCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateSupplyCategorySchema>) {
    const payload = CreateSupplyCategorySchema.parse(body);
    await this.prismaService.supplyCategory.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateSupplyCategorySchema>) {
    const payload = UpdateSupplyCategorySchema.parse(body);
    await this.prismaService.supplyCategory.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async index() {
    return await this.prismaService.supplyCategory.findMany({});
  }

  async isDuplicate(body: z.infer<typeof CreateSupplyCategorySchema>) : Promise<boolean> {

    const payload = CreateSupplyCategorySchema.parse(body);
    const existingData = await this.prismaService.supplyCategory.findFirst({
      where: {
        name: payload.name
      },
      select: {
        name: true,
      },
    });

    const payloadName = slugify(payload.name)
    const existingDataName = slugify(existingData?.name)

    if (payloadName === existingDataName) {
      return true
    }

    return false
  }
}
