import { Shelter, ShelterSupply, Supply } from '@prisma/client';
import { z } from 'zod';
import { SupplyPriority } from '../../supply/types';

const ShelterStatusSchema = z.enum(['available', 'unavailable', 'waiting']);

export type ShelterStatus = z.infer<typeof ShelterStatusSchema>;

const ShelterTagTypeSchema = z.enum([
  'NeedVolunteers',
  'NeedDonations',
  'RemainingSupplies',
]);

const ShelterTagInfoSchema = z.record(
  ShelterTagTypeSchema,
  z.number().optional(),
);

export type ShelterTagType = z.infer<typeof ShelterTagTypeSchema>;

export type ShelterTagInfo = z.infer<typeof ShelterTagInfoSchema>;

export const ShelterSearchPropsSchema = z.object({
  search: z.string().optional(),
  priority: z.preprocess(
    (value) => Number(value) || undefined,
    z.nativeEnum(SupplyPriority).optional(),
  ),
  supplyCategoryIds: z.array(z.string()).optional(),
  supplyIds: z.array(z.string()).optional(),
  shelterStatus: z.array(ShelterStatusSchema).optional(),
  tags: ShelterTagInfoSchema.nullable().optional(),
  cities: z.array(z.string()).optional(),
});

export type ShelterSearchProps = z.infer<typeof ShelterSearchPropsSchema>;

type AllowedShelterFields = Omit<Shelter, 'contact'>;

export type SearchShelterTagResponse = AllowedShelterFields & {
  shelterSupplies: (ShelterSupply & { supply: Supply })[];
};
