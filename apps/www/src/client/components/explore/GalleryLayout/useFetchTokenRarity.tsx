import type { ContractDeployment } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getTokenRank } from 'src/client/utils/image'
import type * as v from 'src/shared/compiler'

export const useFetchTokenRarity = ({
  contractDeployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment | undefined | null
  tokenId: number
}) => {
  const [tokenRarity, setTokenRarity] = useState<v.Rarity | undefined>(undefined)

  // fetch owner from from api/assets/:chainId/:contractAddress/:tokenId/owner
  const fetchData = async () => {
    if (!contractDeployment) return
    try {
      const response = await fetch(
        getTokenRank({
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
    fetchData().then((x) => {
      if (x?.data) setTokenRarity(x.data as v.Rarity)
    })
  }, [contractDeployment?.id])

  return { tokenRarity }
}
