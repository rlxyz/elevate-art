import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import type { UseContractRead } from './types'

export const useFetchContractSaleData = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'publicTime', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'presaleTime', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'claimTime', chainId },
    ],
    watch: true,
    cacheTime: 60_000,
    staleTime: 60_000,
    enabled,
    select: (data) => ({
      publicTime: new Date(Number(BigNumber.from(data[0]).toString()) * 1000),
      presaleTime: new Date(Number(BigNumber.from(data[1]).toString()) * 1000),
      claimTime: new Date(Number(BigNumber.from(data[2]).toString()) * 1000),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}
