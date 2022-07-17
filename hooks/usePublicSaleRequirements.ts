import { useProjectDetail } from '@Context/projectContext'
import { usePublicSaleMaxAllocation, useTotalMinted } from '@Hooks/contractsRead'

interface UsePresaleRequirements {
  collectionNotSoldOut: boolean
  hasMintAllocation: boolean
  maxAllocation: number
  totalMinted: number
  allowToMint: boolean
}

export const usePublicSaleRequirements = (address: string): UsePresaleRequirements => {
  const { totalSupply } = useProjectDetail()
  const maxAllocation = usePublicSaleMaxAllocation(address)
  const totalMinted = useTotalMinted()

  const collectionNotSoldOut = totalMinted < totalSupply
  const hasMintAllocation = maxAllocation > 0
  const allowToMint = collectionNotSoldOut && hasMintAllocation

  return {
    collectionNotSoldOut,
    hasMintAllocation,
    maxAllocation,
    totalMinted,
    allowToMint,
  }
}
