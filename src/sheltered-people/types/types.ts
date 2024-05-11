import z from 'zod';

import { capitalize } from '../../utils';

const ShelteredPeopleSchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  name: z.string().transform(capitalize),
  address: z.string().transform(capitalize),
  cpf: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateShelteredPeopleSchema = ShelteredPeopleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateShelteredPeopleSchema = ShelteredPeopleSchema.pick({
  email: true,
  phone: true,
  gender: true,
}).partial();

const FullUpdateShelteredPeopleSchema = ShelteredPeopleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export {
  ShelteredPeopleSchema,
  CreateShelteredPeopleSchema,
  UpdateShelteredPeopleSchema,
  FullUpdateShelteredPeopleSchema,
};
