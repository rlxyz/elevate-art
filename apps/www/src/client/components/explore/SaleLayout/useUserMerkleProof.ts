import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import type { ContractDeploymentAllowlist, ContractDeploymentAllowlistType } from '@prisma/client'
import { createMerkleTree, generateLeaf } from '@utils/merkle-roots'
import { BigNumber } from 'ethers'
import type MerkleTree from 'merkletreejs'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useUserMerkleProof = ({ type }: { type: ContractDeploymentAllowlistType }) => {
  // fetch address from wagmi
  const { address } = useAccount()
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()
  const [hexProof, setHexProof] = useState<string[] | undefined>(undefined)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [maxMintForUser, setMaxMintForUser] = useState<BigNumber | undefined>(undefined)
  const { data: session } = useSession()
  const { current, all } = useQueryContractDeploymentWhitelistFindClaimByAddress({ type })

  useDeepCompareEffect(() => {
    if (!all?.allowlist) return
    setMerkleTree(createMerkleTree(all.allowlist))
  }, [all?.allowlist])

  useEffect(() => {
    if (!current?.id || !current?.address || !session?.user?.address || current.mint === 0 || !merkleTree)
      return setMaxMintForUser(BigNumber.from(0))
    setHexProof(getHexProof({ current }))
    setMaxMintForUser(BigNumber.from(current.mint))
  }, [session?.user?.address, current?.address, merkleTree])

  useEffect(() => {
    // console.log('session?.user?.address', session?.user?.address)
    // console.log('current?.address', current?.address)
    // console.log('address', address)
    if (session?.user?.address !== current?.address) return setEnabled(false)
    if ((session?.user?.address as `0x${string}`) === address) return setEnabled(true)
    return setEnabled(false)
  }, [session?.user?.address, current?.address, address])

  console.log(enabled)

  const getHexProof = ({ current }: { current: ContractDeploymentAllowlist }) => {
    if (!all?.allowlist) return undefined
    const tree = createMerkleTree(all?.allowlist)
    const leaf: Buffer = generateLeaf(current)
    return tree.getHexProof(leaf)
  }

  return { merkleTree, root: merkleTree?.getHexRoot(), proof: hexProof, maxMintForUser, enabled }
}
