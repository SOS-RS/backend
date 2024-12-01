import z from 'zod';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplySchema, SurplusDemandMatch, UpdateSupplySchema } from './types';

@Injectable()
export class SupplyService {
  constructor(private readonly prismaService: PrismaService) {}

  async store(body: z.infer<typeof CreateSupplySchema>) {
    const payload = CreateSupplySchema.parse(body);
    return await this.prismaService.supply.create({
      data: {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(id: string, body: z.infer<typeof UpdateSupplySchema>) {
    const payload = UpdateSupplySchema.parse(body);
    await this.prismaService.supply.update({
      where: {
        id,
      },
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async index() {
    const data = await this.prismaService.supply.findMany({
      distinct: ['name', 'supplyCategoryId'],
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
        supplyCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return data;
  }

  async surplus_demand_matches(body: z.infer<typeof SurplusDemandMatch>) {
    const payload = SurplusDemandMatch.parse(body);
    const skip = payload.perPage * (payload.page - 1);

    let where: Prisma.Sql[] = [];

    if (payload.supplyId) {
      if (where.length == 0) {
        where.push(Prisma.sql`WHERE spl.supply_id = ${payload.supplyId}`);
      } else {
        where.push(Prisma.sql`spl.supply_id = ${payload.supplyId}`);
      }
    }
    if (payload.shelterIdSurplus) {
      if (where.length == 0) {
        where.push(Prisma.sql`WHERE spl.shelter_id = ${payload.shelterIdSurplus}`);
      } else {
        where.push(Prisma.sql`spl.shelter_id = ${payload.shelterIdSurplus}`);
      }
    }
    if (payload.shelterIdNeeded) {
      if (where.length == 0) {
        where.push(Prisma.sql`WHERE sd.shelter_id = ${payload.shelterIdNeeded}`);
      } else {
        where.push(Prisma.sql`sd.shelter_id = ${payload.shelterIdNeeded}`);
      }
    }

    const query = Prisma.sql`
      WITH supply_surplus AS (
        SELECT
          ss.supply_id,
          sp.name AS supply_name,
          s.id AS shelter_id,
          s.name AS shelter_name
        FROM shelter_supplies ss
        INNER JOIN shelters s ON s.id = ss.shelter_id
        INNER JOIN supplies sp ON sp.id = ss.supply_id
        WHERE ss.priority IN (1) -- 1 is 'Remaining'
      ), supply_demand AS (
        SELECT
          ss.supply_id,
          sp.name AS supply_name,
          s.id AS shelter_id,
          s.name AS shelter_name
        FROM shelter_supplies ss
        INNER JOIN shelters s ON s.id = ss.shelter_id
        INNER JOIN supplies sp ON sp.id = ss.supply_id
        WHERE ss.priority IN (10, 100) -- 10 & 100 are 'Needing' & 'Urgent'
      )
      SELECT
        spl.supply_id,
        spl.supply_name,
        spl.shelter_id AS shelter_from_id,
        spl.shelter_name AS shelter_from_name,
        sd.shelter_id AS shelter_to_id,
        sd.shelter_name AS shelter_to_name
      FROM supply_surplus spl
      INNER JOIN supply_demand sd ON sd.supply_id = spl.supply_id
      ${where.length > 0 ? Prisma.join(where, ' AND ') : Prisma.empty}
      ORDER BY spl.supply_name DESC, shelter_from_name DESC, shelter_to_name DESC
      LIMIT ${payload.perPage} OFFSET ${skip}
    `;

    return await this.prismaService.$queryRaw(query);
  }
}
