import { Injectable } from '@nestjs/common';
import { AccessLevel } from '@prisma/client';

import { AbstractGuard } from './abstract.guard';

@Injectable()
export class StaffGuard extends AbstractGuard {
  constructor() {
    super();
  }
  getAccessLevel(): AccessLevel[] {
    return [AccessLevel.Staff, AccessLevel.Admin];
  }
}
