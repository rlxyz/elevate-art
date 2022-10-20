// @todo connect button export from here.
// @todo typesafe environment variables
import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth";
import "@rainbow-me/rainbowkit/styles.css";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.hardhat,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS ? [chain.rinkeby] : []),
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "default-app",
  chains,
});
const appInfo = { appName: process.env.NEXT_PUBLIC_APP_NAME };
const connectors = connectorsForWallets([...wallets]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "sign in to elevate.art",
});

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
export { ConnectButton } from "./components/ConnectButton";
export {
  getSiweMessageOptions,
  wagmiClient,
  chains,
  appInfo,
  connectors,
  provider,
  wallets,
};
export { useSession };

export const EthereumNextAuthContext = ({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={60} session={session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            appInfo={appInfo}
            chains={chains}
            initialChain={Number(process.env.NEXT_PUBLIC_NETWORK_ID)}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};
