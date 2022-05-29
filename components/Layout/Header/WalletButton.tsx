import { useMemo } from "react";
import { Button } from "@components/Button";
import { ConnectedButton } from "@components/ConnectedButton";
import { useWallet } from "@hooks/useWallet";

export const WalletButton = () => {
  const {
    connect,
    disconnect,
    balance,
    isWalletConnected,
    address,
  } = useWallet();
  const truncatedAddress = useMemo(() => {
    if (address) {
      return `${address.slice(0, 5)}....${address.slice(-5)}`;
    }
    return "";
  }, [address]);

  if (isWalletConnected) {
    return (
      <ConnectedButton
        balance={balance}
        label={truncatedAddress}
        onDisconnect={disconnect}
      />
    );
  }

  return (
    <Button
      className="py-1 px-4 text-sm text-white bg-[#17171a]"
      label="Connect"
      onClick={connect}
    />
  );
};
