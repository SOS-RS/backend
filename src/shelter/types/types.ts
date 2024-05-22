import z from 'zod';

import { capitalize } from '../../utils';
import { removeEmptyStrings } from '@/utils/utils';

export interface DefaultSupplyProps {
  category: string;
  supply: string;
}

const ShelterSchema = z.object({
  id: z.string(),
  name: z.string().transform(capitalize),
  pix: z.string().nullable().optional(),
  address: z.string().transform(capitalize),
  city: z.string().transform(capitalize).nullable().optional(),
  neighbourhood: z.string().transform(capitalize).nullable().optional(),
  street: z.string().transform(capitalize).nullable().optional(),
  streetNumber: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  petFriendly: z.boolean().nullable().optional(),
  shelteredPets: z.number().min(0).nullable().optional(),
  petsCapacity: z.number().min(0).nullable().optional(),
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
  shelteredPets: true,
  petsCapacity: true,
}).partial();

const FullUpdateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .transform(removeEmptyStrings);

export {
  ShelterSchema,
  CreateShelterSchema,
  UpdateShelterSchema,
  FullUpdateShelterSchema,
};
