import {
  getSelectedWallet,
  removeSelectedWallet,
  setSelectedWallet,
} from "@utils/cookies";
import Onboard from "bnc-onboard";
import { API, Wallet } from "bnc-onboard/dist/src/interfaces";
import { ethers } from "ethers";
import * as React from "react";

interface WalletMeta {
  connect: () => void;
  disconnect: () => void;
  address: string;
  balance: string;
  network: number;
  provider: ethers.providers.Web3Provider;
  isWalletConnected: boolean;
}

// @ts-expect-error
const WalletContext = React.createContext<WalletMeta>({});

export function WalletProvider({ children }) {
  const meta = useInitialWallet();

  return (
    <WalletContext.Provider value={meta}>{children}</WalletContext.Provider>
  );
}

export const useWallet = () => {
  return React.useContext<WalletMeta>(WalletContext);
};

const wallets = [
  { walletName: "metamask", preferred: true },
  { walletName: "coinbase", preferred: true },
  {
    walletName: "walletConnect",
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY || "",
    preferred: true,
  },
  {
    walletName: "portis",
    apiKey: process.env.NEXT_PUBLIC_PORTIS_KEY || "",
    label: "Login with Email",
    preferred: true,
  },
  {
    walletName: "fortmatic",
    apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY,
    preferred: true,
  },
];

const useInitialWallet = (): WalletMeta => {
  const [provider, setProvider] =
    React.useState<ethers.providers.Web3Provider>(undefined);
  const [onboard, setOnboard] = React.useState<API>(undefined);
  const [wallet, setWallet] = React.useState<Wallet>(undefined);
  const [address, setAddress] = React.useState("");
  const [network, setNetwork] = React.useState<number>(undefined);
  const [balance, setBalance] = React.useState<string>("0");

  const getOnboard = async () => {
    const subscriptions = {
      address: setAddress,
      network: setNetwork,
      balance: (balance) => {
        if (balance) {
          const ethValue = ethers.utils.formatUnits(balance, 18);
          setBalance(`${ethValue} ${ethers.constants.EtherSymbol}`);
        }
      },
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          setWallet(wallet);
          setProvider(
            new ethers.providers.Web3Provider(wallet.provider, "any")
          );
          setSelectedWallet(wallet.name);
        } else {
          setWallet(undefined);
          setProvider(undefined);
          removeSelectedWallet();
        }
      },
    };

    return Onboard({
      hideBranding: true,
      networkId: Number(process.env.NEXT_PUBLIC_NETWORK_ID || 4),
      darkMode: true,
      subscriptions,
      walletSelect: {
        wallets,
      },
      walletCheck: [
        { checkName: "connect" },
        { checkName: "accounts" },
        { checkName: "network" },
      ],
    });
  };

  const handleLoadOnboard = async () => {
    try {
      const _onboard = await getOnboard();
      setOnboard(_onboard);
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    handleLoadOnboard();
  }, []);

  React.useEffect(() => {
    const init = async () => {
      try {
        onboard.walletReset();
        const selectedWallet = getSelectedWallet();
        if (selectedWallet && selectedWallet !== "") {
          onboard.walletSelect(selectedWallet);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (onboard) {
      init();
    }
  }, [onboard]);

  const connect = React.useCallback(async () => {
    try {
      // Let user select wallet
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) {
        return;
      }

      const walletIsReady = await onboard.walletCheck();
      if (!walletIsReady) {
        return;
      }
    } catch (e) {
      console.warn("Onboard error");
    }
  }, [onboard]);

  const disconnect = React.useCallback(() => {
    onboard.walletReset();
  }, [onboard]);

  return {
    connect,
    disconnect,
    address,
    balance,
    network,
    provider,
    isWalletConnected: Boolean(wallet) && Boolean(address),
  };
};
