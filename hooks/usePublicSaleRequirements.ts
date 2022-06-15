import { usePublicSaleMaxAllocation, useTotalSupply } from '@hooks/contractsRead'
import { config } from '@utils/config'

interface UsePresaleRequirements {
  collectionNotSoldOut: boolean
  hasMintAllocation: boolean
  maxAllocation: number
  totalMinted: number
  allowToMint: boolean
}

export const usePublicSaleRequirements = (address: string): UsePresaleRequirements => {
  const maxAllocation = usePublicSaleMaxAllocation(address)
  const totalMinted = useTotalSupply()

  const collectionNotSoldOut = totalMinted < config.totalSupply
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
