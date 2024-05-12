import { AccessLevel } from '@prisma/client';
import z from 'zod';

import { removeNotNumbers } from '../utils';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  lastName: z.string(),
  login: z.string().transform((v) => v.toLowerCase()),
  password: z.string(),
  phone: z.string().transform(removeNotNumbers),
  accessLevel: z.nativeEnum(AccessLevel),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateUserSchema = UserSchema.pick({
  name: true,
  lastName: true,
  phone: true,
});

const UpdateUserSchema = UserSchema.omit({
  id: true,
  accessLevel: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export { CreateUserSchema, UpdateUserSchema };
