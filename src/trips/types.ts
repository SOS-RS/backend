import z from 'zod';
import { capitalize } from '../utils';

const TripSchema = z.object({
  id: z.string(),
  transportId: z.string(),
  shelterId: z.string(),
  departureCity: z.string().transform(capitalize),
  departureDatetime: z.string(),
  contact: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateTripSchema = TripSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateTripSchema = TripSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  transportId: true,
}).partial();

export { CreateTripSchema, UpdateTripSchema };
