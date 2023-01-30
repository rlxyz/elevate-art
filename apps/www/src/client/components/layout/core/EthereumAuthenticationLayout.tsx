import { connectorsForWallets, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { FC, ReactNode } from 'react'
import { env } from 'src/env/client.mjs'
import { configureChains, createClient, goerli, mainnet, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const DEFAULT_ALCHEMY_KEY = 'CMSJqNTL85ds3C2VslvAA3H16HSgoChH'
const ALCHEMY_MAINNET_KEYS = [
  'CMSJqNTL85ds3C2VslvAA3H16HSgoChH',
  'wPBDyu09SaqHBOoJTMFLkRSzjBjIUnQQ',
  'yG_F19_sVzOdyX44q2d6DukrLoQUTlXU',
  'iO9STXzufmmz1JMfOikXkO6ZYdhWyQtx',
  'llFyryxwhn-wXm2eILsQ2Awj1OehKE-I',
]
const randomKey = () => ALCHEMY_MAINNET_KEYS[Math.floor(Math.random() * ALCHEMY_MAINNET_KEYS.length)] || DEFAULT_ALCHEMY_KEY

const { chains, provider } = configureChains([mainnet, goerli], [alchemyProvider({ apiKey: randomKey() }), publicProvider()])
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
