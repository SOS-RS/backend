import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { z } from 'zod';

import {
  CreateShelterSupplySchema,
  UpdateManyShelterSupplySchema,
  UpdateShelterSupplySchema,
} from '../../../shelter-supply/types';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSupplyHistorySchema } from '../../../supplies-history/types';
import { SupplyPriority } from '../../../supply/types';
import { ShelterSupplyHistoryAction, UserIdentity } from './types';
import { FastifyRequest } from 'fastify';

function registerSupplyLog(
  prismaService: PrismaService,
  body: z.infer<typeof CreateSupplyHistorySchema>,
  user: UserIdentity,
) {
  const fn = async () => {
    const { shelterId, supplyId, ...rest } =
      CreateSupplyHistorySchema.parse(body);

    const prev = await prismaService.supplyHistory.findFirst({
      where: {
        shelterId,
        supplyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prismaService.supplyHistory.create({
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
  prismaService: PrismaService,
  body: z.infer<typeof CreateShelterSupplySchema>,
  user: UserIdentity,
) {
  const payload = CreateShelterSupplySchema.parse(body);
  registerSupplyLog(prismaService, payload, user);
}

function registerUpdateSupplyLog(
  prismaService: PrismaService,
  body: z.infer<typeof UpdateShelterSupplySchema>,
  user: UserIdentity,
) {
  const payload = UpdateShelterSupplySchema.parse(body);

  registerSupplyLog(
    prismaService,
    {
      shelterId: payload.where.shelterId,
      supplyId: payload.where.supplyId,
      priority: payload.data.priority,
      quantity: payload.data.quantity,
    },
    user,
  );
}

function registerUpdateManySupplyLog(
  prismaService: PrismaService,
  body: z.infer<typeof UpdateManyShelterSupplySchema>,
  user: UserIdentity,
) {
  const { ids, shelterId } = UpdateManyShelterSupplySchema.parse(body);

  ids.forEach((id) =>
    registerSupplyLog(
      prismaService,
      {
        shelterId,
        supplyId: id,
        priority: SupplyPriority.UnderControl,
        quantity: 0,
      },
      user,
    ),
  );
}

function handler(
  prismaService: PrismaService,
  action: ShelterSupplyHistoryAction,
  request: FastifyRequest,
) {
  const headers = request.headers;
  const user: UserIdentity = {
    ip: headers['x-real-ip']?.toString(),
    userAgent: headers['user-agent'],
  };

  switch (action) {
    case ShelterSupplyHistoryAction.Create:
      registerCreateSupplyLog(prismaService, request.body as any, user);
      break;
    case ShelterSupplyHistoryAction.Update:
      registerUpdateSupplyLog(
        prismaService,
        {
          data: request.body as any,
          where: request.params as any,
        },
        user,
      );
      break;
    case ShelterSupplyHistoryAction.UpdateMany:
      registerUpdateManySupplyLog(
        prismaService,
        {
          shelterId: (request.params as any).shelterId,
          ids: (request.body as any).ids,
        },
        user,
      );
      break;
  }
}

export { handler };
