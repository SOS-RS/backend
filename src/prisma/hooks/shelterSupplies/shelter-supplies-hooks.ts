import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { z } from 'zod';

import { CreateShelterSupplySchema } from '../../../shelter-supply/types';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSupplyHistorySchema } from '../../../supplies-history/types';
import {
  UpdateManyShelterSupplyHookProps,
  UpdateShelterSupplyHookProps,
} from './types';

function registerSupplyLog(
  prismaService: PrismaService,
  body: z.infer<typeof CreateSupplyHistorySchema>,
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
  params: Prisma.MiddlewareParams,
) {
  if (params.action === 'create' && params.model === 'ShelterSupply') {
    const payload = CreateShelterSupplySchema.parse(params.args.data);
    registerSupplyLog(prismaService, payload);
  }
}

function registerUpdateSupplyLog(
  prismaService: PrismaService,
  params: Prisma.MiddlewareParams,
) {
  if (params.action === 'update' && params.model === 'ShelterSupply') {
    const { data, where } = params.args as UpdateShelterSupplyHookProps;
    registerSupplyLog(prismaService, {
      shelterId: where.shelterId_supplyId.shelterId,
      supplyId: where.shelterId_supplyId.supplyId,
      priority: data.priority,
      quantity: data.quantity,
    });
  }
}

function registerUpdateManySupplyLog(
  prismaService: PrismaService,
  params: Prisma.MiddlewareParams,
) {
  if (params.action === 'updateMany' && params.model === 'ShelterSupply') {
    const {
      data: { priority },
      where: {
        shelterId,
        supplyId: { in: ids },
      },
    } = params.args as UpdateManyShelterSupplyHookProps;

    ids.forEach((id) =>
      registerSupplyLog(prismaService, {
        shelterId,
        supplyId: id,
        priority,
        quantity: 0,
      }),
    );
  }
}

const hooks = [
  registerCreateSupplyLog,
  registerUpdateSupplyLog,
  registerUpdateManySupplyLog,
];

export { hooks };
