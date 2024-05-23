export enum ShelterSupplyHistoryAction {
  Create = 'shelter-supply-history-action/create',
  Update = 'shelter-supply-history-action/update',
  UpdateMany = 'shelter-supply-history-action/update-many',
}

export interface UserIdentity {
  ip?: string;
  userAgent?: string;
  userId?: string;
}
