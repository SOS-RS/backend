import { z } from 'zod';
import { FastifyRequest } from 'fastify';
import { Logger } from '@nestjs/common';

import {
  CreateShelterSupplySchema,
  UpdateShelterSupplySchema,
} from '../../../shelter-supply/types';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSupplyHistorySchema } from '../../../supplies-history/types';
import { ShelterSupplyHistoryAction, UserIdentity } from './types';
import { getSessionData } from '@/utils';

function registerSupplyLog(
  body: z.infer<typeof CreateSupplyHistorySchema>,
  user: UserIdentity = {},
) {
  const fn = async () => {
    const { shelterId, supplyId, ...rest } =
      CreateSupplyHistorySchema.parse(body);

    const prev = await PrismaService.getInstance().supplyHistory.findFirst({
      where: {
        shelterId,
        supplyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await PrismaService.getInstance().supplyHistory.create({
      data: {
        shelterId,
        supplyId,
        ...rest,
        ...user,
        createdAt: new Date().toISOString(),
        predecessorId: prev?.id,
      },
    });
  };

  fn()
    .then(() => {
      Logger.log('Successfully saved shelter supply log', 'ShelterSupplyLog');
    })
    .catch((err) => {
      Logger.error(
        `Failed to save shelter supply log: ${err}`,
        'ShelterSupplyLog',
      );
    });
}

function registerCreateSupplyLog(
  body: z.infer<typeof CreateShelterSupplySchema>,
  user: UserIdentity,
) {
  const payload = CreateShelterSupplySchema.parse(body);
  registerSupplyLog(payload, user);
}

function registerUpdateSupplyLog(
  body: z.infer<typeof UpdateShelterSupplySchema>,
  user: UserIdentity,
) {
  const payload = UpdateShelterSupplySchema.parse(body);

  registerSupplyLog(
    {
      shelterId: payload.where.shelterId,
      supplyId: payload.where.supplyId,
      priority: payload.data.priority,
      quantity: payload.data.quantity,
    },
    user,
  );
}

function handler(
  prismaService: PrismaService,
  action: ShelterSupplyHistoryAction,
  request: FastifyRequest,
) {
  const headers = request.headers;
  const token = headers['authorization'];
  const user: UserIdentity = {
    ip: headers['x-real-ip']?.toString(),
    userAgent: headers['user-agent'],
  };

  if (token) {
    const { userId } = getSessionData(token);
    user.userId = userId;
  }

  switch (action) {
    case ShelterSupplyHistoryAction.Create:
      registerCreateSupplyLog(request.body as any, user);
      break;
    case ShelterSupplyHistoryAction.Update:
      registerUpdateSupplyLog(
        {
          data: request.body as any,
          where: request.params as any,
        },
        user,
      );
      break;
  }
}

export { handler, registerSupplyLog };
