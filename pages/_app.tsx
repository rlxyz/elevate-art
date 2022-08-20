import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

// import ErrorBoundary from '@components/ErrorBoundary'
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit'
import { config } from '@utils/config'
import LogRocket from 'logrocket'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import ReactTooltip from 'react-tooltip'

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.hardhat,
    ...(config.testnetEnabled ? [chain.rinkeby] : []),
  ],
  [
    alchemyProvider({ apiKey: config.alchemyId }),
    infuraProvider({ apiKey: config.infuraId }),
    publicProvider(),
  ]
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

interface AppPropsWithError extends AppProps {
  err: unknown
}

function CustomApp({
  Component,
  pageProps = { title: 'index' },
  err,
}: AppPropsWithError) {
  useEffect(() => {
    config.logrocketKey && LogRocket.init(config.logrocketKey)
  }, [])
  const App = Component as any
  return (
    // <ErrorBoundary>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={appInfo}
        chains={chains}
        initialChain={config.networkId}
      >
        <App {...pageProps} err={err} />
        <Toaster />
        <ReactTooltip />
      </RainbowKitProvider>
    </WagmiConfig>
    // </ErrorBoundary>
  )
}

export default CustomApp
