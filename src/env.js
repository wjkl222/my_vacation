import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),

    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),

    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.coerce.number(),
    EMAIL_USER: z.string(),
    EMAIL_PASSWORD: z.string(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    MAIN_ADMIN_EMAIL: z.string(),
    MAIN_ADMIN_PASSWORD: z.string(),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,

    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    NEXTAUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NEXTAUTH_URL: process.env.BETTER_AUTH_URL,

    MAIN_ADMIN_EMAIL: process.env.MAIN_ADMIN_EMAIL,
    MAIN_ADMIN_PASSWORD: process.env.MAIN_ADMIN_PASSWORD,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
