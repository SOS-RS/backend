import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSchema, UpdateUserSchema } from './types';
import { User } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { generateRandomPassword } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async store(body: any) {
    const { name, lastName, phone } = CreateUserSchema.parse(body);

    const randomPassword = generateRandomPassword(12);

    await this.prismaService.user.create({
      data: {
        name,
        lastName,
        phone,
        password: randomPassword,
        login: phone,
        createdAt: new Date().toISOString(),
      },
    });

    const sendMessage = await this.notificationService.sendWhatsApp(
      phone,
      `Sua nova conta foi criada na plataforma SOS-RS. Sua senha é: ${randomPassword}`,
    );

    if (sendMessage === null) {
      return;
    }
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

  async checkIfUserExists(payload: Partial<User>): Promise<boolean> {
    const result = await this.prismaService.user.findFirst({
      where: payload,
    });

    return !!result;
  }
}
