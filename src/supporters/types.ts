import z from 'zod';

const SupporterSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  link: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateSupporterSchema = SupporterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export { SupporterSchema, CreateSupporterSchema };
