import { state } from '@/utils/utils';
import { SearchSchema } from 'src/types';
import { z } from 'zod';

export const TripSearchPropsSchema = SearchSchema.omit({
  search: true,
}).merge(
  z.object({
    departureCity: z.string().optional(),
    departureState: z.string().transform(state).optional(),
    departureDatetimeStart: z.string().optional(),
    departureDatetimeEnd: z.string().optional(),
    transportId: z.string().optional(),
    shelterIds: z.array(z.string()).optional(),
    userId: z.string().optional(),
  }),
);

export type TripSearchProps = z.infer<typeof TripSearchPropsSchema>;
