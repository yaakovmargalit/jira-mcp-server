import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file for local development
dotenv.config();

const envSchema = z.object({
  JIRA_HOST: z.string().url()
    .refine((val) => val.startsWith('https://'), {
      message: 'JIRA_HOST must start with https://',
    })
    .transform((val) => val.endsWith('/') ? val.slice(0, -1) : val),
  JIRA_EMAIL: z.string().email('JIRA_EMAIL must be a valid email address').optional(),
  JIRA_API_TOKEN: z.string().min(1, 'JIRA_API_TOKEN cannot be empty'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation failed:');
    console.error('Available keys in process.env:', Object.keys(process.env).filter(k => k.startsWith('JIRA_') || k.includes('HOST') || k.includes('TOKEN') || k.includes('EMAIL')).join(', '));
    const formatted = result.error.format();
    for (const [key, val] of Object.entries(formatted)) {
      if (key !== '_errors' && val && '_errors' in val) {
        console.error(`  ${key}: ${val._errors.join(', ')}`);
      }
    }
    process.exit(1);
  }
  return result.data;
};

export const config = parseEnv();
export type EnvConfig = typeof config;
