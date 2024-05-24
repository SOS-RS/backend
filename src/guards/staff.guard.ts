import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessLevel } from '@prisma/client';

import { canActivate } from './utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffGuard extends AuthGuard('jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const ok = await canActivate(this.prismaService, context, [
      AccessLevel.Admin,
      AccessLevel.Staff,
    ]);
    if (ok) return true;

    throw new HttpException('Acesso não autorizado', 401);
  }
}
