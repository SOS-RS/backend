import { DonationOrderStatus } from '@prisma/client';
import z from 'zod';

const DonationOrderScheme = z.object({
  id: z.string(),
  userId: z.string(),
  shelterId: z.string(),
  status: z.enum([
    DonationOrderStatus.Canceled,
    DonationOrderStatus.Complete,
    DonationOrderStatus.Pending,
  ]),
  createdAt: z.string(),
  updatedAt: z.string().nullish(),
});

const CreateDonationOrderScheme = DonationOrderScheme.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  supplies: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
    }),
  ),
});

const UpdateDonationOrderScheme = DonationOrderScheme.pick({
  status: true,
});

export {
  DonationOrderScheme,
  CreateDonationOrderScheme,
  UpdateDonationOrderScheme,
};
