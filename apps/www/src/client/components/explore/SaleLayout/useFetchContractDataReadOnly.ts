import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import type { UseContractRead } from './types'

export const useFetchContractDataReadOnly = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'maxMintPerAddress', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'collectionSize', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'name', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'symbol', chainId },
    ],
    watch: false,
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled,
    select: (data) => ({
      maxMintPerAddress: BigNumber.from(data[0]),
      collectionSize: BigNumber.from(data[1]),
      name: data[2] as string,
      symbol: data[3] as string,
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}
