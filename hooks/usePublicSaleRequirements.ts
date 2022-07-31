import {
  useMintCount,
  usePublicSaleMaxAllocation,
  useTotalMinted,
} from '@Hooks/contractsRead'
import { useGetProjectDetail } from '@Hooks/useGetProjectDetail'

interface UsePresaleRequirements {
  collectionNotSoldOut: boolean
  hasMintAllocation: boolean
  maxAllocation: number
  totalMinted: number
  userMintCount: number
  allowToMint: boolean
}

export const usePublicSaleRequirements = (address: string): UsePresaleRequirements => {
  const { data } = useGetProjectDetail('rlxyz')
  const userMintCount = useMintCount(address)
  const maxAllocation = usePublicSaleMaxAllocation(address)
  const totalMinted = useTotalMinted()

  const collectionNotSoldOut = totalMinted < data?.totalSupply
  const hasMintAllocation = maxAllocation > 0
  const allowToMint = collectionNotSoldOut && hasMintAllocation

  return {
    collectionNotSoldOut,
    hasMintAllocation,
    maxAllocation,
    totalMinted,
    userMintCount,
    allowToMint,
  }
}
