import type { ContractDeployment } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getOwnerOf } from 'src/client/utils/image'

export const useFetchOwner = ({
  contractDeployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment | undefined | null
  tokenId: number
}) => {
  const [owner, setOwner] = useState<string>('0x0000000000000000000000000000000000000000')

  // fetch owner from from api/assets/:chainId/:contractAddress/:tokenId/owner
  const fetchOwner = async () => {
    if (!contractDeployment) return
    try {
      const response = await fetch(
        getOwnerOf({
          contractDeployment,
          tokenId,
        })
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return error
    }
  }

  useEffect(() => {
    fetchOwner().then((x) => {
      if (x?.address) setOwner(x.address)
    })
  }, [contractDeployment?.id])

  return { owner }
}
