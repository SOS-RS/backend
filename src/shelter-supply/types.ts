import z from 'zod';

const ShelterSupplySchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  supplyId: z.string(),
  priority: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateShelterSupplySchema = ShelterSupplySchema.pick({
  shelterId: true,
  supplyId: true,
  priority: true,
});

const UpdateShelterSupplySchema = z.object({
  data: z
    .object({
      shelterId: z.string(),
      supplyId: z.string(),
    })
    .partial(),
  where: z.object({
    shelterId: z.string(),
    supplyId: z.string(),
  }),
});

export {
  ShelterSupplySchema,
  CreateShelterSupplySchema,
  UpdateShelterSupplySchema,
};
