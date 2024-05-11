import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { UpdateUserDTO } from './dtos/UpdateUserDTO';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async store({ name, lastName, phone }: CreateUserDTO) {
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
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
