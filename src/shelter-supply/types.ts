import z from 'zod';

import { SupplyPriority } from '../supply/types';

const ShelterSupplySchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  supplyId: z.string(),
  priority: z.union([
    z.literal(SupplyPriority.UnderControl),
    z.literal(SupplyPriority.Remaining),
    z.literal(SupplyPriority.Needing),
    z.literal(SupplyPriority.Urgent),
  ]),
  quantity: z.number().gt(0).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateShelterSupplySchema = ShelterSupplySchema.pick({
  shelterId: true,
  supplyId: true,
  priority: true,
  quantity: true,
});

const UpdateShelterSupplySchema = z.object({
  data: z
    .object({
      priority: z.union([
        z.literal(SupplyPriority.UnderControl),
        z.literal(SupplyPriority.Remaining),
        z.literal(SupplyPriority.Needing),
        z.literal(SupplyPriority.Urgent),
      ]),
      quantity: z.number().nullable().optional(),
      shelterId: z.string(),
      supplyId: z.string(),
    })
    .partial(),
  where: z.object({
    shelterId: z.string(),
    supplyId: z.string(),
  }),
});

const UpdateManyShelterSupplySchema = z.object({
  ids: z.array(z.string()),
  shelterId: z.string(),
});

export {
  ShelterSupplySchema,
  CreateShelterSupplySchema,
  UpdateShelterSupplySchema,
  UpdateManyShelterSupplySchema,
};
