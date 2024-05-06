import z from 'zod';

const ShelterManagerSchema = z.object({
  shelterId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
});

const CreateShelterManagerSchema = ShelterManagerSchema.pick({
  shelterId: true,
  userId: true,
});

export { ShelterManagerSchema, CreateShelterManagerSchema };
