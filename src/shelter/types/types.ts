import z from 'zod';

import { capitalize } from '../../utils';

export interface DefaultSupplyProps {
  category: string;
  supply: string;
}

const ShelterSchema = z.object({
  id: z.string(),
  name: z.string().transform(capitalize),
  pix: z.string().nullable().optional(),
  address: z.string().transform(capitalize),
  petFriendly: z.boolean().nullable().optional(),
  shelteredPeople: z.number().min(0).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  capacity: z.number().min(0).nullable().optional(),
  contact: z.string().nullable().optional(),
  verified: z.boolean(),
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
