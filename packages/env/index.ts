import { z } from "zod";

const ethereumSchema = z.object({
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_NETWORK_ID: z.number(),
});

const appSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_NODE_ENV: z.string(),
});

const integrationSchema = z.object({
  NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_LOG_ROCKET_KEY: z.string().optional(),
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN: z.string().optional(),
});

const serverAuthSchema = z.object({
  NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

const serverDbSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export { ethereumSchema, appSchema, integrationSchema, serverAuthSchema, serverDbSchema };
