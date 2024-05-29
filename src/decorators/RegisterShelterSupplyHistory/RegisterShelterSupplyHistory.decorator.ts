import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { ShelterSupplyHistoryAction } from '@/interceptors/interceptors/shelter-supply-history/types';
import { ShelterSupplyHistoryInterceptor } from '@/interceptors/interceptors';

export function RegisterShelterSupplyHistory(
  action: ShelterSupplyHistoryAction,
) {
  return applyDecorators(
    UseInterceptors(new ShelterSupplyHistoryInterceptor(action)),
  );
}
