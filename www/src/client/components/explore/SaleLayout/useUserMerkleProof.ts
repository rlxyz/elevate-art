import { useGetMerkleTree } from '@components/create/allowlist/useGetMerkleTree'
import type { WhitelistType } from '@prisma/client'
import { generateLeaf } from '@utils/merkle-roots'
import { BigNumber } from 'ethers'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: WhitelistType }) => {
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({
    type,
  })

  // Generate Tree
  const { merkleTree } = useGetMerkleTree({
    enabled: true,
    data: all?.whitelists,
  })

  if (!current.address || !merkleTree) {
    return {
      proof: undefined,
    }
  }

  // Generate hashed leaf from address
  const leaf: Buffer = generateLeaf(current.address, current.mint.toString())

  // Generate proof
  const proof: string[] = merkleTree?.getHexProof(leaf)

  return {
    proof,
    mint: BigNumber.from(current.mint),
  }
}
