// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  REDIS_URL: z.string(),
  REDIS_TOKEN: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED: z.number(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_NETWORK_ID: z.number(),
  NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_LOG_ROCKET_KEY: z.string().optional(),
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_APP_NAME: "apps/www",
  NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  NEXT_PUBLIC_NETWORK_ID: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID || "",
  NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED: Number(process.env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED) || 9990000,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL // @todo clean up
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.VERCEL_URL
    ? `${process.env.VERCEL_URL}/api`
    : "http://localhost:3000/api",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};
