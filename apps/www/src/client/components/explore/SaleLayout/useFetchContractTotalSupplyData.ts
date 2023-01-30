import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import type { UseContractRead } from './types'

export const useFetchContractTotalSupplyData = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [{ address: contractAddress, abi: RhapsodyContract.abi, functionName: 'totalSupply', chainId }],
    watch: true,
    cacheTime: 36_000,
    staleTime: 36_000,
    enabled,
    select: (data) => ({
      totalSupply: BigNumber.from(data[0]),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}
