import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { useContractRead } from 'wagmi'
import type { UseContractRead } from './types'

export const useFetchContractTokenData = ({
  contractAddress,
  tokenId,
  chainId,
  enabled = true,
  version,
}: UseContractRead & { tokenId: number }) => {
  const { notifyError } = useNotification()
  return useContractRead({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    address: contractAddress,
    chainId,
    abi: RhapsodyContract.abi,
    functionName: 'ownerOf',
    args: [tokenId.toString()],
    watch: false,
    enabled,
    select: (data) => ({
      owner: data as string,
    }),
    onError: () => notifyError('Something wrong fetching contract user data.'),
  })
}
