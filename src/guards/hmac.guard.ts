import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HmacGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const hmacHeader = request.headers['x-hmac-signature'];
    const timestamp = request.headers['x-hmac-timestamp'];

    if (!hmacHeader || !timestamp) {
      throw new UnauthorizedException();
    }

    const secretKey = process.env.HMAC_SECRET_KEY ?? '';
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (Math.abs(currentTimestamp - parseInt(timestamp)) > 10) {
      throw new UnauthorizedException();
    }

    const payload = `${request.method}:${request.url}:${timestamp}:${JSON.stringify(request.body)}`;

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    if (hmac !== hmacHeader) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
