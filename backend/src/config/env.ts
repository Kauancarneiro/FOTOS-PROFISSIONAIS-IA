import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001').transform(Number),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),

    CORS_ORIGIN: z.string().default('http://localhost:5175'),

    UPLOAD_DIR: z.string().default('uploads'),

    TRUST_PROXY: z
      .string()
      .regex(/^\d+$/, 'TRUST_PROXY deve ser um número inteiro (quantidade de proxies à frente)')
      .optional(),

    RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
    RATE_LIMIT_MAX_REQUESTS: z.string().default('600').transform(Number),
  })
  .transform((valores) => ({
    ...valores,
    TRUST_PROXY:
      valores.TRUST_PROXY !== undefined
        ? Number(valores.TRUST_PROXY)
        : valores.NODE_ENV === 'production'
          ? 1
          : 0,
  }));

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
