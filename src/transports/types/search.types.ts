import { SearchSchema } from 'src/types';
import { z } from 'zod';

export const TransportSearchPropsSchema = SearchSchema.omit({
  search: true,
}).merge(
  z.object({
    vehicleType: z.string().optional(),
    vehicleRegistrationPlate: z.string().optional(),
    userId: z.string().optional(),
    tripId: z.string().optional(),
  }),
);

export type TransportSearchProps = z.infer<typeof TransportSearchPropsSchema>;
