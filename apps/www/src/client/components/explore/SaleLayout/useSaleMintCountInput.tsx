import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export const useSaleMintCountInput = ({ enabled }: { enabled: boolean }) => {
  const [mintCount, setMintCount] = useState<BigNumber>(BigNumber.from(1))
  const { isDisconnected } = useAccount()

  useEffect(() => {
    if (isDisconnected) {
      setMintCount(BigNumber.from(1))
    }
  }, [isDisconnected])

  useEffect(() => {
    if (!enabled) {
      setMintCount(BigNumber.from(1))
    }
  }, [enabled])

  return { mintCount, setMintCount }
}
