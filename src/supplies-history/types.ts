import { removeEmptyStrings } from '@/utils/utils';
import { z } from 'zod';

const SupplyHistorySchema = z.object({
  id: z.string(),
  successorId: z.string().nullish(),
  shelterId: z.string(),
  supplyId: z.string(),
  priority: z.number().nullish(),
  quantity: z.number().nullish(),
  createdAt: z.string(),
});

const CreateSupplyHistorySchema = SupplyHistorySchema.omit({
  id: true,
  successorId: true,
  createdAt: true,
}).transform((args) => removeEmptyStrings<typeof args>(args));

export { SupplyHistorySchema, CreateSupplyHistorySchema };
