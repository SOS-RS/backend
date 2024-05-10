import z from 'zod';

import { capitalize } from '../../utils';

export interface DefaultSupplyProps {
  category: string;
  supply: string;
}

const ShelterSchema = z.object({
  id: z.string(),
  name: z.string().transform(capitalize),
  address: z.string().transform(capitalize),
  contact: z.string().nullable().optional(),
  capacity: z.number().nullable().optional(),
  shelteredPeople: z.number().nullable().optional(),
  petFriendly: z.boolean().nullable().optional(),
  pix: z.string().nullable().optional(),
  verified: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verified: true,
});

const UpdateShelterSchema = ShelterSchema.pick({
  petFriendly: true,
  shelteredPeople: true,
}).partial();

const FullUpdateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export {
  ShelterSchema,
  CreateShelterSchema,
  UpdateShelterSchema,
  FullUpdateShelterSchema,
};
