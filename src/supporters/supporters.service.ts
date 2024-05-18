import { z } from 'zod';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupporterSchema } from './types';

@Injectable()
export class SupportersService {
  constructor(private readonly prismaService: PrismaService) {}

  async index() {
    return await this.prismaService.supporters.findMany({});
  }

  async store(body: z.infer<typeof CreateSupporterSchema>) {
    const payload = CreateSupporterSchema.parse(body);
    await this.prismaService.supporters.create({
      data: { ...payload, createdAt: new Date().toISOString() },
    });
  }
}
