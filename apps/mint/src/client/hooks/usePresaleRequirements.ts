import { useMintCount, useMintPeriod, usePresaleMaxAllocation, useTotalMinted } from 'src/client/hooks/contractsRead'
import { useQueryContractDeployment } from './useQueryContractDeployment'

interface UsePresaleRequirements {
  inAllowlist: boolean
  collectionNotSoldOut: boolean
  presaleIsActive: boolean
  hasMintAllocation: boolean
  maxAllocation: number
  userAllocation: number
  totalMinted: number
  allowToMint: boolean
  userMintCount: number
}

export const usePresaleRequirements = ({ address }: { address: `0x${string}` | undefined }): UsePresaleRequirements => {
  const { current } = useQueryContractDeployment()
  const mintCount = useMintCount({ address })
  const allocation = usePresaleMaxAllocation({ address })
  const totalMinted = useTotalMinted()
  const { mintPhase } = useMintPeriod()

  const totalAvailableToMint = allocation - mintCount
  const inAllowlist = allocation > 0
  const collectionNotSoldOut = totalMinted < (current?.deployment?.repositoryDeployment?.collectionTotalSupply || 0)
  const presaleIsActive = mintPhase === 'presale'
  const hasMintAllocation = totalAvailableToMint > 0
  const allowToMint = inAllowlist && collectionNotSoldOut && presaleIsActive && hasMintAllocation

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
  }
}
