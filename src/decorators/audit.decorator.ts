import { getSessionData } from '@/utils/utils';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Decorator que recupera o ip / id do usuário atual da requisição e permite passar
 * quais propriedades do modelo do prisma
 *
 * ```ts
 *  updateFoo(@AuditProperties<'User'>(['phone','name']) auditProperties:any)){
 *  // ...sua lógica aqui
 *  // irá registar as alterações nos campos `phone` e `name` na auditoria.
 * }
 * ```
 */
const AuditProperties: <T extends keyof typeof Prisma.ModelName>(
  auditProps: (keyof Prisma.TypeMap['model'][T]['fields'])[],
) => ParameterDecorator = createParamDecorator(
  (auditProps, ctx: ExecutionContext) => {
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
  },
);

/**
 * Decorator que recupera o ip / id do usuário atual da requisição.
 */
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
