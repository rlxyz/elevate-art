import { connectorsForWallets, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { FC, ReactNode } from 'react'
import { env } from 'src/env/client.mjs'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.hardhat, chain.goerli],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }), infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
)
const { wallets } = getDefaultWallets({ appName: env.NEXT_PUBLIC_APP_NAME, chains })
export const appInfo = { appName: env.NEXT_PUBLIC_APP_NAME }
const connectors = connectorsForWallets([...wallets])
const wagmiClient = createClient({ autoConnect: true, connectors, provider })
const getSiweMessageOptions: GetSiweMessageOptions = () => ({ statement: 'sign in to elevate.art' })

export const EthereumAuthenticationLayout: FC<{ session: Session | null; children: ReactNode }> = ({ children, session }) => {
  return (
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
            {children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}
