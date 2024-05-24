import z from 'zod';

import { capitalize } from '../../utils';
import { removeEmptyStrings } from '@/utils/utils';

export interface DefaultSupplyProps {
  category: string;
  supply: string;
}

const petFriendlyRefinement = function(obj, ctx) {
  if(!obj.petFriendly) {
    if(obj.petCapacity) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Shelter is not pet friendly',
      path: ['petCapacity']
    });

    if(obj.shelteredPets) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Shelter is not pet friendly',
      path: ['shelteredPets']
    });
  }
};

const ShelterSchema = z.object({
  id: z.string(),
  name: z.string().transform(capitalize),
  pix: z.string().nullable().optional(),
  address: z.string().transform(capitalize),
  city: z.string().transform(capitalize).nullable().optional(),
  neighbourhood: z.string().transform(capitalize).nullable().optional(),
  street: z.string().transform(capitalize).nullable().optional(),
  streetNumber: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  petFriendly: z.boolean().nullable().optional(),
  shelteredPeople: z.number().min(0).nullable().optional(),
  shelteredPets: z.number().min(0).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  capacity: z.number().min(0).nullable().optional(),
  petCapacity: z.number().min(0).nullable().optional(),
  contact: z.string().nullable().optional(),
  verified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

const CreateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verified: true,
}).superRefine(petFriendlyRefinement);

const UpdateShelterSchema = ShelterSchema.pick({
  petFriendly: true,
  shelteredPeople: true,
  petCapacity: true,
  shelteredPets: true
}).partial()
  .superRefine(petFriendlyRefinement);

const FullUpdateShelterSchema = ShelterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .transform((args) => removeEmptyStrings<typeof args>(args))
  .superRefine(petFriendlyRefinement);

export {
  ShelterSchema,
  CreateShelterSchema,
  UpdateShelterSchema,
  FullUpdateShelterSchema,
};
