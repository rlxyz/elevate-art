import type { Whitelist } from '@prisma/client'
import { createMerkleTree } from '@utils/merkle-roots'
import { useEffect, useState } from 'react'

export const useSetMerkleRootData = ({ enabled, data }: { enabled: boolean; data: Whitelist[] | undefined }) => {
  const [merkleRoot, setMerkleRoot] = useState<string>('0x0000000000000000000000000000000000000000000000000000000000000000')

  useEffect(() => {
    if (!data) return
    setMerkleRoot(createMerkleTree(data).getHexRoot())
  }, [data])

  return { merkleRoot, setMerkleRoot }
}
