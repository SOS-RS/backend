import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginSchema, TokenPayload } from './types';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: any) {
    const { login, password, ip, userAgent } = LoginSchema.parse(body);
    const user = await this.prismaService.user.findUnique({
      where: { login },
    });
    if (!user) throw new Error('Usuário não encontrado');
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) throw new Error('Senha incorreta');

    await this.prismaService.session.updateMany({
      where: {
        user: {
          login,
        },
        active: true,
      },
      data: {
        active: false,
        updatedAt: new Date().toISOString(),
      },
    });

    const session = await this.prismaService.session.create({
      data: {
        userId: user.id,
        ip,
        userAgent,
        createdAt: new Date().toISOString(),
      },
    });

    const payload: TokenPayload = {
      sessionId: session.id,
      userId: user.id,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async show(id: string) {
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        login: true,
        phone: true,
        accessLevel: true,
        createdAt: true,
      },
    });
    return data;
  }

  async delete(props: TokenPayload) {
    const { sessionId, userId } = props;
    const data = await this.prismaService.session.update({
      where: {
        id: sessionId,
        userId,
      },
      data: {
        updatedAt: new Date().toISOString(),
        active: false,
      },
    });
    return data;
  }
}
