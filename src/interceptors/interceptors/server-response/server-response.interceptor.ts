import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';

import { ServerResponse } from '@/utils/utils';

@Injectable()
export class ServerResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        if (result instanceof ServerResponse) {
          const response: FastifyReply = context.switchToHttp().getResponse();
          const data = result.data;
          response.status(data.statusCode);
          return data;
        } else {
          return result;
        }
      }),
    );
  }
}
