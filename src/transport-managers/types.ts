import z from 'zod';

const TransportManagerSchema = z.object({
  transportId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateTransportManagerSchema = TransportManagerSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export { CreateTransportManagerSchema };
