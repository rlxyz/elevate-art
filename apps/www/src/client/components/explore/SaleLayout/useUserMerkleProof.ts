import { useGetMerkleTree } from '@components/create/allowlist/useGetMerkleTree'
import type { WhitelistType } from '@prisma/client'
import { BigNumber } from 'ethers'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: WhitelistType }) => {
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({
    type,
  })

  const { merkleTree, getHexProof, root } = useGetMerkleTree({
    data: all?.whitelists,
  })

  if (!current?.address || current.mint === 0 || !merkleTree) {
    return {
      proof: undefined,
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
    mint: BigNumber.from(current.mint),
  }
}
