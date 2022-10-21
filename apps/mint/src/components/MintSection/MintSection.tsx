import { useMintPeriod } from "@hooks/contractsRead";

import { PresaleView } from "./PresaleView";
import { PublicView } from "./PublicView";
import { WalletChecker } from "./WalletChecker";

export const MintSection = () => {
  const { mintPhase } = useMintPeriod();

  if (mintPhase === "presale") {
    return <PresaleView />;
  }

  if (mintPhase === "public") {
    return <PublicView />;
  }

  return <WalletChecker />;
};
