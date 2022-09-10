// src/pages/_app.tsx
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '../server/router'
import type { AppProps } from 'next/app'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { RepositoryContext, createRepositoryStore } from '@hooks/useRepositoryStore'
import { createRepositoryRouterStore, RepositoryRouterContext } from '@hooks/useRepositoryRouterStore'
import { Toaster } from 'react-hot-toast'
import { env } from 'src/env/client.mjs'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.hardhat, ...(env.NEXT_PUBLIC_ENABLE_TESTNETS ? [chain.rinkeby] : [])],
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
  {
    groupName: 'Other',
    wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Elevate.art',
})

const ElevateCompilerApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider appInfo={appInfo} chains={chains} initialChain={env.NEXT_PUBLIC_NETWORK_ID}>
            <RepositoryRouterContext.Provider createStore={() => createRepositoryRouterStore}>
              <RepositoryContext.Provider createStore={() => createRepositoryStore}>
                <Component {...pageProps} />
                <Toaster />
              </RepositoryContext.Provider>
            </RepositoryRouterContext.Provider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(ElevateCompilerApp)
