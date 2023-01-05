import type { Whitelist } from '@prisma/client'
import { createMerkleTree } from '@utils/merkle-roots'
import { convertListToMap } from '@utils/object-utils'
import type MerkleTree from 'merkletreejs'
import { useEffect, useState } from 'react'

export const useGetMerkleTree = ({ enabled, data }: { enabled: boolean; data: Whitelist[] | undefined }) => {
  const [merkleTree, setMerkleTree] = useState<MerkleTree>()

  useEffect(() => {
    if (!data) return
    setMerkleTree(
      createMerkleTree(
        convertListToMap(
          data.map((x) => ({
            address: x.address,
            mint: String(x.mint),
          })),
          'address',
          'mint'
        )
      )
    )
  }, [data])

  return { merkleTree }
}
