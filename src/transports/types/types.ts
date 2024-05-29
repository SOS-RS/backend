import z from 'zod';

const TransportSchema = z.object({
  id: z.string(),
  vehicleType: z.string(),
  vehicleRegistrationPlate: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateTransportSchema = TransportSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateTransportSchema = TransportSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export { CreateTransportSchema, UpdateTransportSchema };
