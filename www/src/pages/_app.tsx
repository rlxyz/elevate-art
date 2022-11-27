// src/pages/_app.tsx
import { ErrorBoundary } from '@highlight-run/react'
import { connectorsForWallets, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import '@rainbow-me/rainbowkit/styles.css'
import { Analytics } from '@vercel/analytics/react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { AppType } from 'next/app'
import { createOrganisationNavigationStore, OrganisationRouterContext } from 'src/client/hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from 'src/client/hooks/store/useRepositoryStore'
import { env } from 'src/env/client.mjs'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import '../client/styles/globals.css'
import '../client/utils/highlight'
import { trpc } from '../client/utils/trpc'
export { reportWebVitals } from 'next-axiom'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.hardhat, chain.goerli],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }), infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
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
                    title='Elevate Art'
                    description='Design your NFT collection with our leading art generator. Build the perfect collection for your community. Upload your base images, tweak your layers, and algorithmically generate your full collection.'
                    openGraph={{
                      type: 'website',
                      locale: 'en_US',
                      url: 'https://elevate.art/',
                      site_name: 'elevate.art',
                      images: [
                        {
                          url: 'https://uploads-ssl.webflow.com/62fb25dec6d6000039acf36b/630df414a98b27db93462c57_Open%20Graph.png',
                          width: 1600,
                          height: 840,
                          alt: 'Elevate Art',
                        },
                      ],
                    }}
                    twitter={{
                      handle: '@elevate_art',
                      cardType: 'summary',
                    }}
                  />
                  <Component {...pageProps} />
                  <Analytics />
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
