import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessLevel } from '@prisma/client';

import { canActivate } from './utils';

@Injectable()
export class TransportManagerGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const ok = await canActivate(context, [
      AccessLevel.TransportManager,
      AccessLevel.Staff,
      AccessLevel.Admin,
    ]);
    if (ok) return true;
    throw new HttpException('Acesso não autorizado', 401);
  }
}
