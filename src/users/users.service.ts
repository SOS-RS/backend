import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSchema, UpdateUserSchema } from './types';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: CreateUserDto) {
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

  async update(id: string, body: UpdateUserDto) {
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
