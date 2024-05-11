import z from 'zod';
import { capitalize } from '../utils';

enum SupplyPriority {
  UnderControl = 0,
  Remaining = 1,
  Needing = 10,
  Urgent = 100,
}

const SupplySchema = z.object({
  id: z.string(),
  supplyCategoryId: z.string(),
  name: z.string().transform(capitalize),
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
}).partial();

const SurplusDemandMatch = z.object({
  supplyId: z.string().nullable().optional(),
  page: z.preprocess((v) => +((v ?? '1') as string), z.number().min(1)),
  perPage: z.preprocess(
    (v) => +((v ?? '10') as string),
    z.number().min(1).max(100),
  ),
});

export {
  SupplySchema,
  CreateSupplySchema,
  UpdateSupplySchema,
  SurplusDemandMatch,
  SupplyPriority
};
