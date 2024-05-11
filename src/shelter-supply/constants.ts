const jobInterval: string =
  process.env.SHELTER_SUPPLY_PRIORITY_JOB_INTERVAL ?? '0 */30 * * * *';

const priorityExpiryInterval: number = Number.parseInt(
  process.env.SHELTER_SUPPLY_PRIORITY_EXPIRY_INTERVAL ?? '4',
);

export { jobInterval, priorityExpiryInterval };
