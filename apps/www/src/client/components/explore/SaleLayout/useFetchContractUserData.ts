import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import type { UseContractUserRead } from './types'

export const useFetchContractUserData = ({ contractAddress, userAdress, chainId, enabled = true, version }: UseContractUserRead) => {
  const { notifyError } = useNotification()

  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}:${userAdress}:mintOf`,
    contracts: [{ address: contractAddress, abi: RhapsodyContract.abi, functionName: 'mintOf', args: [userAdress], chainId }],
    watch: true,
    cacheTime: 12_000,
    staleTime: 12_000,
    enabled: enabled,
    select: (data) => ({
      userMintCount: BigNumber.from(data[0]),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please try again later.'),
  })
}
