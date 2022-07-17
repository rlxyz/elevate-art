import { PublicSaleAllocation, TotalMinted } from '@Components/MintRequirements'
import { usePublicSaleRequirements } from '@Hooks/usePublicSaleRequirements'
import { useAccount } from 'wagmi'

export const PublicSaleRequirements = () => {
  const account = useAccount()
  const { totalMinted, collectionNotSoldOut } = usePublicSaleRequirements(
    account?.address,
  )
  return (
    <>
      <TotalMinted totalMinted={totalMinted} isEligible={collectionNotSoldOut} />
      <PublicSaleAllocation />
    </>
  )
}
