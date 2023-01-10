import type { Whitelist } from '@prisma/client'
import { createMerkleTree } from '@utils/merkle-roots'
import { convertListToMap } from '@utils/object-utils'
import type MerkleTree from 'merkletreejs'
import { useEffect, useState } from 'react'

export const useGetMerkleTree = ({ data }: { data: Whitelist[] | undefined }) => {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()

  useEffect(() => {
    if (!data) return

    setMerkleTree(
      createMerkleTree(
        convertListToMap(
          data.map(({ address, mint }) => ({
            address,
            mint: mint.toString(),
          })),
          'address',
          'mint'
        )
      )
    )
  }, [data])

  return { merkleTree }
}
