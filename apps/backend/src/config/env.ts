import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});


const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}
export const env = parsedEnv.data;