import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractRead, useContractReads } from 'wagmi'

export interface UseContractReads {
  contractAddress: string
  chainId: number
  version: string
  enabled?: boolean
}

interface UseContractUserRead extends UseContractReads {
  userAdress?: string | null | undefined
}

export const useFetchContractUserData = ({ contractAddress, userAdress, chainId, enabled = true, version }: UseContractUserRead) => {
  const { notifyError } = useNotification()

  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [{ address: contractAddress, abi: RhapsodyContract.abi, functionName: 'mintOf', args: [userAdress], chainId }],
    watch: true,
    cacheTime: 10_000,
    staleTime: 10_000,
    enabled: enabled,
    select: (data) => ({
      userMintCount: BigNumber.from(data[0]),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please try again later.'),
  })
}

export type UseContractRead = UseContractReads

export const useFetchContractDataMutatableOnly = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()
  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'totalSupply', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'presaleMerkleRoot', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'claimMerkleRoot', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'claimTime', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'presaleTime', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'publicTime', chainId },
    ],
    watch: true,
    enabled,
    select: (data) => ({
      totalSupply: BigNumber.from(data[0]),
      presaleMerkleRoot: data[1] as string,
      claimMerkleRoot: data[2] as string,
      claimTime: new Date(Number(BigNumber.from(data[3]).toString()) * 1000),
      presaleTime: new Date(Number(BigNumber.from(data[4]).toString()) * 1000),
      publicTime: new Date(Number(BigNumber.from(data[5]).toString()) * 1000),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}

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
      maxPublicBatchPerAddress: BigNumber.from(data[0]),
      collectionSize: BigNumber.from(data[1]),
      name: data[2] as string,
      symbol: data[3] as string,
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please refresh the page.'),
  })
}

export const useFetchContractData = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const {
    data: readOnly,
    isLoading: isLoadingReadOnly,
    isError: isErrorReadOnly,
  } = useFetchContractDataReadOnly({ contractAddress, chainId, enabled, version })
  const {
    data: dataMutatable,
    isLoading: isLoadingMutatable,
    isError: isErrorMutatable,
  } = useFetchContractDataMutatableOnly({ contractAddress, chainId, enabled, version })
  return {
    data: {
      ...readOnly,
      ...dataMutatable,
      collectionMintLeft: BigNumber.from(readOnly?.collectionSize || 0).sub(BigNumber.from(dataMutatable?.totalSupply || 0)) as BigNumber,
    },
    isLoading: isLoadingReadOnly || isLoadingMutatable,
    isError: isErrorReadOnly || isErrorMutatable,
  }
}
