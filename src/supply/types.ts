import z from 'zod';

enum SupplyPriority {
  UnderControl = 0,
  Remaining = 1,
  Needing = 10,
  Urgent = 100,
}

const SupplySchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  supplyCategoryId: z.string(),
  name: z.string(),
  priority: z.union([
    z.literal(SupplyPriority.UnderControl),
    z.literal(SupplyPriority.Remaining),
    z.literal(SupplyPriority.Needing),
    z.literal(SupplyPriority.Urgent),
  ]),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateSupplySchema = SupplySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateSupplySchema = SupplySchema.pick({
  name: true,
  supplyCategoryId: true,
  priority: true,
}).partial();

export { SupplySchema, CreateSupplySchema, UpdateSupplySchema, SupplyPriority };
