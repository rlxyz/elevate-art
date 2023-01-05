import type { Whitelist } from '@prisma/client'
import { createMerkleTree } from '@utils/merkle-roots'
import { convertListToMap } from '@utils/object-utils'
import { useEffect, useState } from 'react'

export const useSetMerkleRootData = ({ enabled, data }: { enabled: boolean; data: Whitelist[] | undefined }) => {
  const [merkleRoot, setMerkleRoot] = useState<string>('0x0000000000000000000000000000000000000000000000000000000000000000')

  useEffect(() => {
    if (!data) return
    setMerkleRoot(
      createMerkleTree(
        convertListToMap(
          data.map((x) => ({
            address: x.address,
            mint: String(x.mint),
          })),
          'address',
          'mint'
        )
      ).getHexRoot()
    )
  }, [data])

  return { merkleRoot, setMerkleRoot }
}
