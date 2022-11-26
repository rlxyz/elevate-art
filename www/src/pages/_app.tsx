// src/pages/_app.tsx
import { ErrorBoundary } from '@highlight-run/react'
import { createOrganisationNavigationStore, OrganisationRouterContext } from '@hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from '@hooks/store/useRepositoryStore'
import { connectorsForWallets, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '@rainbow-me/rainbowkit/styles.css'
import { H } from 'highlight.run'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { Toaster } from 'react-hot-toast'
import { env } from 'src/env/client.mjs'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import '../styles/globals.css'

import { trpc } from '@utils/trpc'
import { Session } from 'next-auth'
import { AppType } from 'next/app'

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

const ElevateCompilerApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ErrorBoundary showDialog>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={60} session={session}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider
              appInfo={appInfo}
              chains={chains}
              initialChain={env.NEXT_PUBLIC_NETWORK_ID}
              theme={lightTheme({
                accentColor: '#0070F3',
                accentColorForeground: 'white',
                borderRadius: 'small',
                fontStack: 'system',
                overlayBlur: 'small',
              })}
            >
              <OrganisationRouterContext.Provider createStore={() => createOrganisationNavigationStore}>
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
              </OrganisationRouterContext.Provider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </ErrorBoundary>
  )
}

export default trpc.withTRPC(ElevateCompilerApp)
