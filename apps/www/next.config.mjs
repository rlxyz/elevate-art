import withBundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  if (process.env.ANALYZE) {
    return withBundleAnalyzer(config)
  }
  if (process.env.NODE_ENV === 'production') {
    return withAxiom(config)
  }
  return config
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'staging.elevate.art' },
      { protocol: 'https', hostname: 'elevate.art' },
    ],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
})
