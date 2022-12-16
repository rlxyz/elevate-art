import withBundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))
const mintBasePath = process.env.NEXT_PUBLIC_MINT_CLIENT_BASE_PATH ?? '' // mint
const mintBaseUrl = process.env.NEXT_PUBLIC_MINT_CLIENT_URL ?? ''

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
    domains: ['res.cloudinary.com', 'localhost'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: `/${mintBasePath}`,
        destination: `${`${mintBaseUrl}`}/${mintBasePath}`,
      },
      {
        source: `/${mintBasePath}/:path*`,
        destination: `${mintBaseUrl}/${mintBasePath}/:path*`,
      },
    ]
  },
})
