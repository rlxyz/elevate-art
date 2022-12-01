// @ts-check
import { z } from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  ESS_CLOUD_ID: z.string(),
  ESS_CLOUD_USERNAME: z.string(),
  ESS_CLOUD_PASSWORD: z.string(),
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
})

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_APP_NAME: 'elevate_art_rng.png',
  NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
}
