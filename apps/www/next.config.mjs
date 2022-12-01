import withBundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'
import withTM from 'next-transpile-modules'

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
const defineNextConfig = (config) => {
  if (process.env.ANALYZE) {
    return withBundleAnalyzer(config)
  }
  if (process.env.NODE_ENV === 'production') {
    return withAxiom(config)
  }
  return config
}

export default withTM(['@elevateart/ui', '@elevateart/eth-auth', '@elevateart/db', '@elevateart/api', '@elevateart/compiler'])(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['res.cloudinary.com', 'localhost'],
    },
    i18n: {
      locales: ['en'],
      defaultLocale: 'en',
    },
  })
)
