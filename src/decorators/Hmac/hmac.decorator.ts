import { applyDecorators, UseGuards } from '@nestjs/common';

import { HmacGuard } from '@/guards/hmac.guard';

export function Hmac() {
  return applyDecorators(UseGuards(HmacGuard));
}
