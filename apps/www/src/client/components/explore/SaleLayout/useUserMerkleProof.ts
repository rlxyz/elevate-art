import { useSetMerkleRootData } from '@components/create/allowlist/useSetMerkleRoot'
import type { ContractDeploymentAllowlist, ContractDeploymentAllowlistType } from '@prisma/client'
import { createMerkleTree, generateLeaf } from '@utils/merkle-roots'
import { BigNumber } from 'ethers'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: ContractDeploymentAllowlistType }) => {
  // fetch address from wagmi
  const { address } = useAccount()
  const [hexProof, setHexProof] = useState<string[] | undefined>(undefined)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [maxMintForUser, setMaxMintForUser] = useState<BigNumber | undefined>(undefined)
  const { data: session } = useSession()
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({ type })
  const { merkleRoot } = useSetMerkleRootData({ enabled, data: all })

  useEffect(() => {
    if (!current?.id || !current?.address || !session?.user?.address || current.mint === 0 || !merkleRoot)
      return setMaxMintForUser(BigNumber.from(0))
    setHexProof(getHexProof({ current }))
    setMaxMintForUser(BigNumber.from(current.mint))
  }, [session?.user?.address, current?.address, merkleRoot])

  useEffect(() => {
    // console.log('session?.user?.address', session?.user?.address)
    // console.log('current?.address', current?.address)
    // console.log('address', address)
    if (session?.user?.address !== current?.address) return setEnabled(false)
    if ((session?.user?.address as `0x${string}`) === address) return setEnabled(true)
    return setEnabled(false)
  }, [session?.user?.address, current?.address, address])

  const getHexProof = ({ current }: { current: ContractDeploymentAllowlist }) => {
    if (!all) return undefined
    const tree = createMerkleTree(all)
    const leaf: Buffer = generateLeaf(current)
    return tree.getHexProof(leaf)
  }

  return { root: merkleRoot, proof: hexProof, maxMintForUser, enabled }
}
