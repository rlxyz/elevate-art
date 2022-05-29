import { useQuery } from "react-query";
import { MintPhase, Token } from "state/token";
import {
  getSuccessfulTransactionHash,
  getSuccessfulTransactionHashWithPhase,
} from "@utils/cookies";

export const useGetTokenIds = (address: string, mintPhase: MintPhase) => {
  const { getTokenIdsFromTxHash } = Token.useContainer();

  let trxHash: string;
  if (mintPhase === "claim") {
    trxHash = getSuccessfulTransactionHash(address);
  }

  if (mintPhase === "presale" || mintPhase === "public") {
    trxHash = getSuccessfulTransactionHashWithPhase(address, mintPhase);
  }

  const { isLoading, data } = useQuery(
    `fetch-token-id-${trxHash}`,
    () => getTokenIdsFromTxHash(trxHash),
    {
      enabled: !!address && !!trxHash && mintPhase !== "none",
    }
  );

  return {
    isLoading,
    data: !!trxHash ? data?.filter((x) => !!x || x === 0) : [],
  };
};
