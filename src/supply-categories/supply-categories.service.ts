import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSupplyCategorySchema,
  UpdateSupplyCategorySchema,
} from './types';
import { CreateSupplyCategoryDTO } from './dtos/CreateSupplyCategoryDTO';
import { UpdateSupplyCategoryDTO } from './dtos/UpdateSupplyCategoryDTO';

@Injectable()
export class SupplyCategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: CreateSupplyCategoryDTO) {
    const payload = CreateSupplyCategorySchema.parse(body);
    await this.prismaService.supplyCategory.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: UpdateSupplyCategoryDTO) {
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
