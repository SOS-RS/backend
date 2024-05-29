import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ShelterSupplyHistoryAction } from './types';
import { handler } from './utils';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShelterSupplyHistoryInterceptor implements NestInterceptor {
  constructor(private readonly action: ShelterSupplyHistoryAction) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    handler(PrismaService.getInstance(), this.action, request);
    return next.handle();
  }
}
