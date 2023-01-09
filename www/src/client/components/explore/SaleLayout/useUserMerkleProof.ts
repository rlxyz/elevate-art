import { useGetMerkleTree } from '@components/create/allowlist/useGetMerkleTree'
import type { WhitelistType } from '@prisma/client'
import { generateLeaf } from '@utils/merkle-roots'
import { BigNumber } from 'ethers'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: WhitelistType }) => {
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({
    type,
  })

  const { merkleTree } = useGetMerkleTree({
    enabled: true,
    data: all?.whitelists,
  })

  if (!current.address || !merkleTree) {
    return {
      proof: undefined,
    }
  }

  const leaf: Buffer = generateLeaf(current.address, current.mint.toString())

  const proof: string[] = merkleTree.getHexProof(leaf)

  if (!proof || proof.length === 0) {
    return {
      proof: undefined,
    }
  }

  return {
    proof,
    mint: BigNumber.from(current.mint),
  }
}
