import type { UseContractRead } from '@components/explore/SaleLayout/types'
import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { useContractRead } from 'wagmi'

export const useFetchContractBaseURI = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractRead({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    address: contractAddress,
    chainId,
    abi: RhapsodyContract.abi,
    functionName: 'baseURI',
    watch: true,
    enabled,
    select: (data) => ({
      baseURI: data as string,
    }),
    onError: () => notifyError('Something wrong fetching contract baseURI data.'),
  })
}
