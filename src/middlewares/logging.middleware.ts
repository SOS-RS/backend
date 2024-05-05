import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { getSessionData } from '@/utils';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger(LoggingMiddleware.name);
  use(req: Request, _: Response, next: () => void) {
    const { method, originalUrl, headers } = req;
    const ip = headers['x-real-ip'] || req.ip;
    const token = headers.authorization?.split('Bearer ').at(-1);
    const appVersion = headers['app-version'];
    const userAgent = headers['user-agent'];
    if (!headers['content-type']) headers['content-type'] = 'application/json';
    const { userId } = getSessionData(token);
    const message = `${appVersion} - ${method} ${originalUrl} ${ip} ${userAgent} (${userId})`;
    this.logger.log(message);

    next();
  }
}
