import { useNotification } from '@hooks/utils/useNotification'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import { z } from 'zod'

export const SalePhaseEnum = z.nativeEnum(
  Object.freeze({
    Presale: 'presale',
    Public: 'public',
  })
)

export type SalePhase = z.infer<typeof SalePhaseEnum>

interface UseContractReads {
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
    cacheTime: 2_000,
    staleTime: 2_000,
    enabled: enabled,
    select: (data) => ({
      userMintCount: BigNumber.from(data[0]),
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please try again later.'),
  })
}

type UseContractRead = UseContractReads

export const useFetchContractData = ({ contractAddress, chainId, enabled = true, version }: UseContractRead) => {
  const { notifyError } = useNotification()

  return useContractReads({
    scopeKey: `erc721:${version}:${chainId}:${contractAddress}`,
    contracts: [
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'totalSupply', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'maxPublicBatchPerAddress', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'collectionSize', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'presaleMerkleRoot', chainId },
      { address: contractAddress, abi: RhapsodyContract.abi, functionName: 'claimMerkleRoot', chainId },
    ],
    watch: true,
    cacheTime: 2_000,
    staleTime: 2_000,
    enabled,
    select: (data) => ({
      totalMinted: BigNumber.from(data[0]),
      maxAllocation: BigNumber.from(data[1]),
      collectionSize: BigNumber.from(data[2]),
      collectionMintLeft: BigNumber.from(data[2]).sub(BigNumber.from(data[0])) as BigNumber,
      presaleMerkleRoot: data[3] as string,
      claimMerkleRoot: data[4] as string,
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please try again later.'),
  })
}
