// src/pages/_app.tsx
import { AppRouter } from '@elevateart/api'
import { appInfo, chains, getSiweMessageOptions, wagmiClient } from '@elevateart/ui-eth-auth'
import { ErrorBoundary } from '@highlight-run/react'
import { CollectionRouterContext, createCollectionNavigationStore } from '@hooks/store/useCollectionNavigationStore'
import { createOrganisationNavigationStore, OrganisationRouterContext } from '@hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from '@hooks/store/useRepositoryStore'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '@rainbow-me/rainbowkit/styles.css'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { H } from 'highlight.run'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'
import { env } from 'src/env/client.mjs'
import superjson from 'superjson'
import { WagmiConfig } from 'wagmi'
import '../styles/globals.css'

if (process.env.NEXT_PUBLIC_NODE_ENV === 'production' && env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID !== '') {
  H.init(env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
    environment: env.NEXT_PUBLIC_NODE_ENV,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    // version: (process.env.VERCEL_GIT_COMMIT_SHA as string) || env.NEXT_PUBLIC_NODE_ENV, // default to production
    // enableStrictPrivacy: false, see: https://docs.highlight.run/privacy#pU2Cn
  })
}

const ElevateCompilerApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ErrorBoundary showDialog>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={60} session={pageProps.session}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider appInfo={appInfo} chains={chains} initialChain={Number(process.env.NEXT_PUBLIC_NETWORK_ID)}>
              <OrganisationRouterContext.Provider createStore={() => createOrganisationNavigationStore}>
                <CollectionRouterContext.Provider createStore={() => createCollectionNavigationStore}>
                  <RepositoryContext.Provider createStore={() => createRepositoryStore}>
                    <DefaultSeo
                      title='elevate.art'
                      description='a general purpose image compiler for nft projects'
                      openGraph={{
                        type: 'website',
                        locale: 'en_US',
                        url: 'https://elevate.art/',
                        site_name: 'elevate.art',
                      }}
                      twitter={{
                        handle: '@elevate_art',
                        cardType: 'summary',
                      }}
                    />
                    <Component {...pageProps} />
                    {/* <Toaster /> */}
                  </RepositoryContext.Provider>
                </CollectionRouterContext.Provider>
              </OrganisationRouterContext.Provider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </ErrorBoundary>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      // To use SSR properly you need to forward the client's headers to the server
      headers: () => {
        if (ctx?.req) {
          const headers = ctx?.req?.headers
          delete headers?.connection
          return {
            ...headers,
            'x-ssr': '1',
          }
        }
        return {}
      },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(ElevateCompilerApp)
