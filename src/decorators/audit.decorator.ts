import { getSessionData } from '@/utils/utils';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const AuditProperties: <T>(auditProps: (keyof T)[]) => ParameterDecorator =
  createParamDecorator((auditProps, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { headers } = req;
    const ipAddress = headers['x-real-ip'] || req.ip;
    const token = headers.authorization?.split('Bearer ').at(-1);
    const { userId } = getSessionData(token);

    return {
      auditProps,
      ipAddress,
      userId,
    };
  });

const SessionData = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const { headers } = req;
  const ipAddress = headers['x-real-ip'] || req.ip;
  const token = headers.authorization?.split('Bearer ').at(-1);
  const { userId } = getSessionData(token);

  return {
    ipAddress,
    userId,
  };
});

type SessionData = {
  userId?: string;
  ipAddress?: string;
};

export { SessionData, AuditProperties };
