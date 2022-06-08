import '../styles/globals.scss'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-medium-image-zoom/dist/styles.css'

import { Layout } from '@components/Layout/Layout'
import { useStore } from '@hooks/useStore'
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit'
import { config } from '@utils/config'
import { rollbar } from '@utils/rollbar'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, ...(config.testnetEnabled ? [chain.rinkeby] : [])],
  [
    alchemyProvider({ alchemyId: config.alchemyId }),
    infuraProvider({ infuraId: config.infuraId }),
    publicProvider(),
  ],
)

const { wallets } = getDefaultWallets({
  appName: config.projectName,
  chains,
})

const appInfo = {
  appName: config.projectName,
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
  webSocketProvider,
})

const queryClient = new QueryClient()

interface AppPropsWithError extends AppProps {
  err: unknown
}

function CustomApp({
  Component,
  pageProps = { title: 'index' },
  err,
}: AppPropsWithError) {
  const router = useRouter()

  useEffect(() => {
    useStore.setState({ router, rollbar })
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider appInfo={appInfo} chains={chains}>
          <Layout>
            <Component {...pageProps} err={err} />
            <Toaster />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default CustomApp
