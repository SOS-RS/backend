import { Injectable } from '@nestjs/common';
import { AccessLevel } from '@prisma/client';

import { AbstractGuard } from './abstract.guard';

@Injectable()
export class UserGuard extends AbstractGuard {
  constructor() {
    super();
  }

  getAccessLevel(): AccessLevel[] {
    return [
      AccessLevel.User,
      AccessLevel.Staff,
      AccessLevel.DistributionCenter,
      AccessLevel.Admin,
    ];
  }
}
