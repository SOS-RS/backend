import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { CreateTransportSchema } from './types';

@Injectable()
export class TransportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateTransportSchema>) {
    const payload = CreateTransportSchema.parse(body);

    await this.prismaService.transport.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
