import { Shelter, ShelterSupply, Supply } from '@prisma/client';
import { SupplyPriority } from '../../supply/types';

export type ShelterAvailabilityStatus = 'available' | 'unavailable' | 'waiting';

export interface IFilterFormProps {
  search: string;
  priority: SupplyPriority | null;
  supplyCategoryIds: string[];
  supplyIds: string[];
  shelterStatus: ShelterAvailabilityStatus[];
  tags: ShelterTagInfo | null;
}

type AllowedShelterFields = Omit<Shelter, 'contact'>;

export type SearchShelterTagResponse = AllowedShelterFields & {
  shelterSupplies: (ShelterSupply & { supply: Supply })[];
};

export type ShelterTagType =
  | 'NeedVolunteers'
  | 'NeedDonations'
  | 'RemainingSupplies';

export type ShelterTagInfo = {
  [key in ShelterTagType]?: number;
};
