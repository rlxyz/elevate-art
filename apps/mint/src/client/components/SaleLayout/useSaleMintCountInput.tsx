import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export const useSaleMintCountInput = ({ isError, isLoading }: { isLoading: boolean; isError: boolean }) => {
  const [mintCount, setMintCount] = useState<BigNumber>(BigNumber.from(1))
  const { isDisconnected } = useAccount()

  useEffect(() => {
    if (isDisconnected) {
      setMintCount(BigNumber.from(1))
    }
  }, [isDisconnected])

  useEffect(() => {
    if (!isLoading && isError) {
      setMintCount(BigNumber.from(1))
    }
  }, [isError, isLoading])

  return { mintCount, setMintCount }
}
