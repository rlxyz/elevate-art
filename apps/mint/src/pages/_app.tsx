import '@rainbow-me/rainbowkit/styles.css'
import 'react-medium-image-zoom/dist/styles.css'
import '../client/styles/globals.css'

import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { config } from 'src/client/utils/config'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.hardhat, ...(config.testnetEnabled ? [chain.rinkeby] : [])],
  [
    alchemyProvider({ apiKey: config.alchemyId }),
    infuraProvider({ apiKey: config.infuraId }),
    publicProvider(),
  ],
)

const { wallets } = getDefaultWallets({
  appName: config.appName,
  chains,
})

const appInfo = {
  appName: config.appName,
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

const queryClient = new QueryClient()

interface AppPropsWithError extends AppProps {
  err: unknown
}

function CustomApp({
  Component,
  pageProps = { title: 'index' },
  err,
}: AppPropsWithError) {
  // useEffect(() => {
  //   LogRocket.init(config.logrocketKey)
  // }, [])

  return (
    // <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={appInfo}
          chains={chains}
          initialChain={config.networkId}
        >
          <Component {...pageProps} err={err} />
          <Toaster />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
    // </ErrorBoundary>
  )
}

export default CustomApp
