import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import { CreatePartnerSchema } from './types';

@ApiTags('Parceiros')
@Injectable()
export class PartnersService {
  constructor(private readonly prismaService: PrismaService) {}

  async index() {
    return await this.prismaService.partners.findMany({});
  }

  async store(body: z.infer<typeof CreatePartnerSchema>) {
    const payload = CreatePartnerSchema.parse(body);
    await this.prismaService.partners.create({
      data: { ...payload, createdAt: new Date().toISOString() },
    });
  }
}
