import z from 'zod';

const LoginSchema = z.object({
  login: z.string().transform((v) => v.toLowerCase()),
  password: z.string(),
  ip: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

interface TokenPayload {
  sessionId: string;
  userId: string;
}

export { LoginSchema, TokenPayload };
