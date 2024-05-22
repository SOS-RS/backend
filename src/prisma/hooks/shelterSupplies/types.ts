export interface UpdateShelterSupplyHookProps {
  where: UpdateShelterSupplyHookPropsWhere;
  data: UpdateShelterSupplyHookPropsData;
}

export interface UpdateShelterSupplyHookPropsData {
  priority: number;
  quantity: number;
  updatedAt?: string | null;
}

export interface UpdateShelterSupplyHookPropsWhere {
  shelterId_supplyId: UpdateShelterSupplyHookPropsShelterIDSupplyID;
}

export interface UpdateShelterSupplyHookPropsShelterIDSupplyID {
  shelterId: string;
  supplyId: string;
}

export interface UpdateManyShelterSupplyHookProps {
  where: UpdateManyShelterSupplyHookPropsWhere;
  data: UpdateManyShelterSupplyHookPropsData;
}

export interface UpdateManyShelterSupplyHookPropsData {
  priority: number;
  updatedAt?: string | null;
}

export interface UpdateManyShelterSupplyHookPropsWhere {
  shelterId: string;
  supplyId: UpdateManyShelterSupplyHookPropsSupplyID;
}

export interface UpdateManyShelterSupplyHookPropsSupplyID {
  in: string[];
}
