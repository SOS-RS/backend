import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShelterSupplySchema,
  UpdateManyShelterSupplySchema,
  UpdateShelterSupplySchema,
} from './types';
import { SupplyPriority } from '../supply/types';
import { CreateShelterSupplyDTO } from './dtos/CreateShelterSupplyDTO';
import { UpdateShelterSupplyDTO } from './dtos/UpdateShelterSupplyDTO';
import { UpdateManyShelterSupplySchemaDTO } from './dtos/UpdateManyShelterSupplyDTO';

@Injectable()
export class ShelterSupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  private async handleUpdateShelterSum(
    shelterId: string,
    oldPriority: number,
    newPriority: number,
  ) {
    await this.prismaService.shelter.update({
      where: {
        id: shelterId,
      },
      data: {
        prioritySum: {
          increment: newPriority - oldPriority,
        },
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async store(body: CreateShelterSupplyDTO) {
    const { shelterId, priority, supplyId, quantity } =
      CreateShelterSupplySchema.parse(body);
    await this.handleUpdateShelterSum(shelterId, 0, priority);
    await this.prismaService.shelterSupply.create({
      data: {
        shelterId,
        priority,
        supplyId,
        quantity: priority !== SupplyPriority.UnderControl ? quantity : null,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(
    body: UpdateShelterSupplyDTO,
    shelterId: string,
    supplyId: string,
  ) {
    const {
      shelterId: shelterIdParse,
      supplyId: supplyIdParse,
      priority,
      quantity,
    } = UpdateShelterSupplySchema.parse({ ...body, shelterId, supplyId });
    if (priority !== null && priority !== undefined) {
      const shelterSupply = await this.prismaService.shelterSupply.findFirst({
        where: {
          shelterId: shelterIdParse,
          supplyId: supplyIdParse,
        },
        select: {
          priority: true,
        },
      });

      if (shelterSupply)
        await this.handleUpdateShelterSum(
          shelterIdParse,
          shelterSupply.priority,
          priority,
        );
    }

    await this.prismaService.shelterSupply.update({
      where: {
        shelterId_supplyId: {
          shelterId: shelterIdParse,
          supplyId: supplyIdParse,
        },
      },
      data: {
        priority: priority ?? undefined,
        quantity: priority !== SupplyPriority.UnderControl ? quantity : null,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async updateMany(body: UpdateManyShelterSupplySchemaDTO, shelterId: string) {
    const { ids, shelterId: shelterIdParsed } =
      UpdateManyShelterSupplySchema.parse({ ...body, shelterId });

    const supplies = await this.prismaService.shelterSupply.findMany({
      where: {
        shelterId: shelterIdParsed,
        supplyId: {
          in: ids,
        },
      },
    });

    const prioritySum = supplies.reduce(
      (prev, current) => prev + current.priority,
      0,
    );

    await this.prismaService.$transaction([
      this.prismaService.shelter.update({
        where: {
          id: shelterIdParsed,
        },
        data: {
          prioritySum: {
            decrement: prioritySum,
          },
          updatedAt: new Date().toISOString(),
        },
      }),
      this.prismaService.shelterSupply.updateMany({
        where: {
          shelterId: shelterIdParsed,
          supplyId: {
            in: ids,
          },
        },
        data: {
          priority: SupplyPriority.UnderControl,
          updatedAt: new Date().toISOString(),
        },
      }),
    ]);
  }

  async index(shelterId: string) {
    return await this.prismaService.shelterSupply.findMany({
      where: {
        shelterId,
      },
      select: {
        priority: true,
        quantity: true,
        supply: {
          select: {
            id: true,
            name: true,
            supplyCategory: {
              select: {
                id: true,
                name: true,
              },
            },
            updatedAt: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
