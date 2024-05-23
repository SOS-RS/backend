import { ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessLevel } from '@prisma/client';
import { canActivate } from './utils';

export abstract class AbstractGuard extends AuthGuard('jwt') {
  abstract getAccessLevel(): AccessLevel[];
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const ok = await canActivate(context, this.getAccessLevel());
    if (ok) return true;
    throw new HttpException('Acesso não autorizado', 401);
  }
}
