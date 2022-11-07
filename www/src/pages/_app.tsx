// src/pages/_app.tsx
import { ErrorBoundary } from '@highlight-run/react'
import { CollectionRouterContext, createCollectionNavigationStore } from '@hooks/store/useCollectionNavigationStore'
import { createOrganisationNavigationStore, OrganisationRouterContext } from '@hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from '@hooks/store/useRepositoryStore'
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '@rainbow-me/rainbowkit/styles.css'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { H } from 'highlight.run'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { env } from 'src/env/client.mjs'
import superjson from 'superjson'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import type { AppRouter } from '../server/router'
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

const { chains, provider } = configureChains(
  [chain.mainnet, chain.hardhat, chain.goerli],
  [
    alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }),
    infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ]
)

const { wallets } = getDefaultWallets({
  appName: env.NEXT_PUBLIC_APP_NAME,
  chains,
})

const appInfo = {
  appName: env.NEXT_PUBLIC_APP_NAME,
}

const connectors = connectorsForWallets([
  ...wallets,
  // {
  //   groupName: 'Other',
  //   // wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
  // },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'sign in to elevate.art',
})

const ElevateCompilerApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ErrorBoundary showDialog>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={60} session={pageProps.session}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider appInfo={appInfo} chains={chains} initialChain={env.NEXT_PUBLIC_NETWORK_ID}>
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
                    <Toaster />
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
