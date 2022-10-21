import {
  PresaleAllocation,
  PresaleTiming,
  TotalMinted,
  UserInAllowList,
} from "@components/MintRequirements";
import { usePresaleRequirements } from "@hooks/usePresaleRequirements";
import { useAccount } from "wagmi";

export const PresaleRequirements = () => {
  const account = useAccount();
  const {
    inAllowlist,
    collectionNotSoldOut,
    maxAllocation,
    hasMintAllocation,
    totalMinted,
  } = usePresaleRequirements(account?.address);
  return (
    <>
      <UserInAllowList isEligible={inAllowlist} />
      <TotalMinted
        totalMinted={totalMinted}
        isEligible={collectionNotSoldOut}
      />
      <PresaleTiming />
      <PresaleAllocation
        isEligible={hasMintAllocation}
        maxAllocation={maxAllocation}
      />
    </>
  );
};
