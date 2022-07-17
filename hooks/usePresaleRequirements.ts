import { useProjectDetail } from '@Context/projectContext'
import {
  useMintCount,
  useMintPeriod,
  usePresaleMaxAllocation,
  useTotalMinted,
} from '@Hooks/contractsRead'

interface UsePresaleRequirements {
  inAllowlist: boolean
  collectionNotSoldOut: boolean
  presaleIsActive: boolean
  hasMintAllocation: boolean
  maxAllocation: number
  totalMinted: number
  allowToMint: boolean
}

export const usePresaleRequirements = (address: string): UsePresaleRequirements => {
  const { totalSupply } = useProjectDetail()
  const mintCount = useMintCount(address)
  const maxAllocation = usePresaleMaxAllocation(address)
  const totalMinted = useTotalMinted()
  const { mintPhase } = useMintPeriod()

  const totalAvailableToMint = maxAllocation - mintCount
  const inAllowlist = maxAllocation > 0
  const collectionNotSoldOut = totalMinted < totalSupply
  const presaleIsActive = mintPhase === 'presale'
  const hasMintAllocation = totalAvailableToMint > 0
  const allowToMint =
    inAllowlist && collectionNotSoldOut && presaleIsActive && hasMintAllocation

  return {
    inAllowlist,
    collectionNotSoldOut,
    presaleIsActive,
    hasMintAllocation,
    maxAllocation: totalAvailableToMint,
    totalMinted,
    allowToMint,
  }
}
