import { useGetMerkleTree } from '@components/create/allowlist/useGetMerkleTree'
import type { ContractDeploymentAllowlistType } from '@prisma/client'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: ContractDeploymentAllowlistType }) => {
  const [maxMintForUser, setMaxMintForUser] = useState<BigNumber | undefined>(undefined)
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({ type })
  const { merkleTree, getHexProof, root } = useGetMerkleTree({ data: all?.allowlist })

  useEffect(() => {
    if (!current?.address || current.mint === 0 || !merkleTree) {
      return setMaxMintForUser(BigNumber.from(0))
    }

    if (current.mint) {
      setMaxMintForUser(BigNumber.from(current.mint))
    }
  }, [current?.mint])

  if (!current?.address || current.mint === 0 || !merkleTree) {
    return {
      root,
      proof: undefined,
      maxMintForUser,
    }
  }

  const proof = getHexProof({ current })

  if (!proof || proof.length === 0) {
    return {
      proof: undefined,
    }
  }

  return {
    root,
    proof,
    maxMintForUser,
  }
}
