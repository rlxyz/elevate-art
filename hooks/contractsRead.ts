import { config } from '@utils/config'
import { RhapsodyContractConfig } from '@utils/constant'
import { presaleConfig } from '@utils/merkle_roots'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useAccount, useContractRead } from 'wagmi'

export const useMintCount = (address: string): number => {
  const { data } = useContractRead(RhapsodyContractConfig, 'mintOf', {
    args: address,
    watch: true,
  })

  const mintCount = useMemo(() => data?.toNumber(), [data])

  return mintCount
}

export const useTotalSupply = (): number => {
  const { data } = useContractRead(RhapsodyContractConfig, 'totalSupply', {
    watch: true,
  })

  const totalSupply = useMemo(() => {
    if (data) {
      return data.toNumber()
    }
    return 0
  }, [data])

  return totalSupply
}

interface UseMintPeriod {
  presaleTime: number
  publicTime: number
  mintPhase: 'public' | 'presale' | 'none'
}

export const useMintPeriod = (): UseMintPeriod => {
  const { data: account } = useAccount()
  const { data: contractPresaleTime } = useContractRead(
    RhapsodyContractConfig,
    'presaleTime',
    {
      watch: true,
      enabled: !!account?.address,
    },
  )
  const { data: contractPublicTime } = useContractRead(
    RhapsodyContractConfig,
    'publicTime',
    {
      watch: true,
      enabled: !!account?.address,
    },
  )

  const presaleTime = useMemo(
    () => contractPresaleTime?.toNumber(),
    [contractPresaleTime],
  )
  const publicTime = useMemo(() => contractPublicTime?.toNumber(), [contractPublicTime])
  const now = Math.floor(Date.now() / 1000)

  const mintPhase = useMemo(() => {
    if (presaleTime == null || publicTime == null) {
      return 'none'
    }

    if (now > presaleTime && now < publicTime) {
      return 'presale'
    } else if (now > publicTime) {
      return 'public'
    } else {
      return 'none'
    }
  }, [presaleTime, publicTime])

  return {
    presaleTime,
    publicTime,
    mintPhase,
  }
}

export const usePresaleMaxAllocation = (address = ''): number => {
  if (!address) {
    return 0
  }

  const formattedAddress = ethers.utils.getAddress(address)

  if (formattedAddress in presaleConfig.whitelist) {
    return presaleConfig.whitelist[formattedAddress]
  } else if (address in presaleConfig.whitelist) {
    return presaleConfig.whitelist[address]
  } else if (address.toLowerCase() in presaleConfig.whitelist) {
    return presaleConfig.whitelist[address.toLowerCase()]
  } else {
    return 0
  }
}

export const usePublicSaleMaxAllocation = (address: string) => {
  const totalSupply = useTotalSupply()
  const mintCount = useMintCount(address)
  const totalMintLeft = config.maxPublicAllocationPerAddress - mintCount

  if (
    totalSupply + config.maxPublicAllocationPerAddress >
    config.maxPublicAllocationPerAddress
  ) {
    const collectionLeft = config.totalSupply - totalSupply
    if (totalMintLeft < collectionLeft) {
      return totalMintLeft
    }
    return collectionLeft
  }

  return totalMintLeft
}
