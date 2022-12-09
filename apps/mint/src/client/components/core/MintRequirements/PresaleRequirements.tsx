import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import { useAccount } from 'wagmi'

import { PresaleAllocation } from './PresaleAllocation'
import { PresaleTiming } from './PresaleTiming'
import { TotalMinted } from './TotalMinted'
import { UserInAllowList } from './UserInAllowlist'

export const PresaleRequirements = () => {
  const account = useAccount()
  const { inAllowlist, collectionNotSoldOut, maxAllocation, hasMintAllocation, totalMinted } = usePresaleRequirements(account?.address)
  return (
    <>
      <UserInAllowList isEligible={inAllowlist} />
      <TotalMinted totalMinted={totalMinted} isEligible={collectionNotSoldOut} />
      <PresaleTiming />
      <PresaleAllocation isEligible={hasMintAllocation} maxAllocation={maxAllocation} />
    </>
  )
}
