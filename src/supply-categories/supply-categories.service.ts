import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import {
  CreateSupplyCategorySchema,
  UpdateSupplyCategorySchema,
} from './types';

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
}
