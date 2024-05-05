import z from 'zod';
import { capitalize } from '../utils';

export enum SupplyStatus {
  UnderControl = 'UnderControl',
  Remaining = 'Remaining',
  Needing = 'Needing',
  Urgent = 'Urgent',
}

const SupplyCategorySchema = z.object({
  id: z.string(),
  name: z.string().transform(capitalize),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateSupplyCategorySchema = SupplyCategorySchema.pick({
  name: true,
});

const UpdateSupplyCategorySchema = SupplyCategorySchema.pick({
  name: true,
}).partial();

export {
  SupplyCategorySchema,
  CreateSupplyCategorySchema,
  UpdateSupplyCategorySchema,
};
