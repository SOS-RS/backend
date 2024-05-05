import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSchema, UpdateUserSchema } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: any) {
    const { name, lastName, phone } = CreateUserSchema.parse(body);
    await this.prismaService.user.create({
      data: {
        name,
        lastName,
        phone,
        password: phone,
        login: phone,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: any) {
    const payload = UpdateUserSchema.parse(body);
    await this.prismaService.user.update({
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
