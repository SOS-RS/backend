import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ShelterSupplyHistoryAction } from './types';
import { handler } from './utils';
import { prisma } from '../../../prisma/prisma.service';

@Injectable()
export class ShelterSupplyHistoryInterceptor implements NestInterceptor {
  constructor(private readonly action: ShelterSupplyHistoryAction) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    handler(prisma, this.action, request);
    return next.handle();
  }
}
