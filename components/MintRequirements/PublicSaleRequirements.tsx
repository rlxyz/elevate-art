import { PublicSaleAllocation, TotalMinted } from '@components/MintRequirements'
import { usePublicSaleRequirements } from '@hooks/usePublicSaleRequirements'
import { useAccount } from 'wagmi'

export const PublicSaleRequirements = () => {
  const { data: account } = useAccount()
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
