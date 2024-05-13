import { ExecutionContext } from '@nestjs/common';
import { AccessLevel } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const service = new PrismaService();

async function canActivate(context: ExecutionContext, allowed: AccessLevel[]) {
  const http = context.switchToHttp();
  const request = http.getRequest();
  if (request.user) {
    const { userId, sessionId } = request.user;

    return isRightSessionRole(allowed, sessionId, userId);
  }

  return false;
}

async function isRightSessionRole(
  allowed: AccessLevel[],
  sessionId?: string,
  userId?: string,
) {
  if (!sessionId) return false;
  if (!userId) return false;

  const session = await service.session.findUnique({
    where: { id: sessionId, active: true, user: { id: userId } },
    include: {
      user: true,
    },
  });

  if (
    session &&
    allowed.some((permission) => permission === session.user.accessLevel)
  ) {
    return true;
  }
  return false;
}

export { canActivate };
