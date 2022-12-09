import {
  PresaleAllocation,
  PresaleTiming,
  TotalMinted,
  UserInAllowList,
} from '@Components/MintRequirements'
import { usePresaleRequirements } from '@Hooks/usePresaleRequirements'
import { useAccount } from 'wagmi'

export const PresaleRequirements = () => {
  const account = useAccount()
  const {
    inAllowlist,
    collectionNotSoldOut,
    maxAllocation,
    hasMintAllocation,
    totalMinted,
  } = usePresaleRequirements(account?.address)
  return (
    <>
      <UserInAllowList isEligible={inAllowlist} />
      <TotalMinted totalMinted={totalMinted} isEligible={collectionNotSoldOut} />
      <PresaleTiming />
      <PresaleAllocation isEligible={hasMintAllocation} maxAllocation={maxAllocation} />
    </>
  )
}
