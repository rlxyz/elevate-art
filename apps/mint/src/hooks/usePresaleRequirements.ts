import {
  useMintCount,
  useMintPeriod,
  usePresaleMaxAllocation,
  useTotalMinted,
} from "@hooks/contractsRead";
import { useGetProjectDetail } from "@hooks/useGetProjectDetail";

interface UsePresaleRequirements {
  inAllowlist: boolean;
  collectionNotSoldOut: boolean;
  presaleIsActive: boolean;
  hasMintAllocation: boolean;
  maxAllocation: number;
  userAllocation: number;
  totalMinted: number;
  allowToMint: boolean;
  userMintCount: number;
}

export const usePresaleRequirements = (
  address: string
): UsePresaleRequirements => {
  const { data } = useGetProjectDetail("rlxyz");
  const mintCount = useMintCount(address);
  const allocation = usePresaleMaxAllocation(address);
  const totalMinted = useTotalMinted();
  const { mintPhase } = useMintPeriod();

  const totalAvailableToMint = allocation - mintCount;
  const inAllowlist = allocation > 0;
  const collectionNotSoldOut = totalMinted < data?.totalSupply;
  const presaleIsActive = mintPhase === "presale";
  const hasMintAllocation = totalAvailableToMint > 0;
  const allowToMint =
    inAllowlist && collectionNotSoldOut && presaleIsActive && hasMintAllocation;

  return {
    inAllowlist,
    collectionNotSoldOut,
    presaleIsActive,
    hasMintAllocation,
    userAllocation: allocation,
    maxAllocation: totalAvailableToMint,
    totalMinted,
    allowToMint,
    userMintCount: mintCount,
  };
};
