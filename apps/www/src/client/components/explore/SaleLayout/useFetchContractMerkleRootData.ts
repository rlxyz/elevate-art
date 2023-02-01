import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { useContractReads } from 'wagmi'
import type { UseContractRead } from './types'

export const useFetchContractMerkleRootData = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}:merkleRoots`,
    contracts: [
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'presaleMerkleRoot', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'claimMerkleRoot', chainId },
    ],
    watch: true,
    cacheTime: 60_000,
    staleTime: 60_000,
    enabled,
    select: (data) => ({
      presaleMerkleRoot: data[0] as string,
      claimMerkleRoot: data[1] as string,
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}
