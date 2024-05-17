import z from 'zod';

const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreatePartnerSchema = PartnerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export { PartnerSchema, CreatePartnerSchema };
