import z from 'zod';

export enum SupplyStatus {
  UnderControl = 'UnderControl',
  Remaining = 'Remaining',
  Needing = 'Needing',
  Urgent = 'Urgent',
}

const SupplyCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const SupplySchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  supplyCategoryId: z.string(),
  name: z.string(),
  status: z.enum([
    SupplyStatus.UnderControl,
    SupplyStatus.Remaining,
    SupplyStatus.Needing,
    SupplyStatus.Urgent,
  ]),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateSupplySchema = SupplySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export { SupplySchema, CreateSupplySchema };
