import z from 'zod';

import { capitalize } from '../utils';

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
  shelteredPeople: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  capacity: z.number().nullable().optional(),
  contact: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const ComplexSearchSchema = z.object({
  search: z.preprocess((v) => v ?? '', z.string()),
  status: z.array(z.number()).nullable().optional(),
  perPage: z.preprocess(
    (v) => +((v ?? '20') as string),
    z.number().min(1).max(100),
  ),
  filterAvailableShelter: z.preprocess(
    (v) => (v === 'true' ? true : false),
    z.boolean(),
  ),
  filterUnavailableShelter: z.preprocess(
    (v) => (v === 'true' ? true : false),
    z.boolean(),
  ),
  waitingShelterAvailability: z.preprocess(
    (v) => (v === 'true' ? true : false),
    z.boolean(),
  ),
  page: z.preprocess((v) => +((v ?? '1') as string), z.number().min(1)),
  supplyCategories: z.array(z.string()).nullable().optional(),
  supplies: z.array(z.string()).nullable().optional(),
  priority: z.string().nullable().optional(),
  order: z.string(),
  orderBy: z.string().nullable().optional(),
});

const CreateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  ComplexSearchSchema,
};
