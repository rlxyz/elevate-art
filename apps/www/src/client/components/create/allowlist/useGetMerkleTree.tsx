import type { Whitelist } from '@prisma/client'
import { createMerkleTree, generateLeaf } from '@utils/merkle-roots'
import type MerkleTree from 'merkletreejs'
import { useEffect, useState } from 'react'

export const useGetMerkleTree = ({ data }: { data: Whitelist[] | undefined }) => {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()

  useEffect(() => {
    if (!data) return
    setMerkleTree(createMerkleTree(data))
  }, [data])

  const getHexProof = ({ current }: { current: Whitelist }) => {
    if (!data) return undefined
    const tree = createMerkleTree(data)
    const leaf: Buffer = generateLeaf(current)
    return tree.getHexProof(leaf)
  }

  return { merkleTree, root: merkleTree?.getHexRoot(), getHexProof }
}
