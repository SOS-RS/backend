import z from 'zod';

const ShelterManagerSchema = z.object({
  shelterId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

const CreateShelterManagerSchema = ShelterManagerSchema.pick({
  shelterId: true,
  userId: true,
});

export { ShelterManagerSchema, CreateShelterManagerSchema };
