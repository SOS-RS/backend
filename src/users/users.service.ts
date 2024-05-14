import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { UpdateUserDTO } from './dtos/UpdateUserDTO';
import { CreateUserSchema, UpdateUserSchema } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: CreateUserDTO) {
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

  async update(id: string, body: UpdateUserDTO) {
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
