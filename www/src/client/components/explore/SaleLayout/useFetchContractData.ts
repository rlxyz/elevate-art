import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { BigNumber } from 'ethers'
import type { Session } from 'next-auth'
import { useBalance, useContractReads } from 'wagmi'
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
    enabled: true,
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
    }),
    onError: () => notifyError('Something wrong fetching contract data. Please try again later.'),
  })
}

export const useFetchSaleRequirements = ({
  session,
  contractDeployment,
  type,
}: {
  session: Session | null
  contractDeployment: ContractDeployment
  type: SalePhase
}) => {
  /** Get user balance */
  const {
    data: userBalance,
    isLoading: isLoadingUserBalance,
    isError: isErrorUserBalance,
  } = useBalance({
    address: session?.user?.address as `0x${string}`,
    enabled: !!session?.user?.address,
  })

  /** Fetch the user-mint data from Contract */
  const {
    data: fetchedContractUserData,
    isLoading: isLoadingContractUserData,
    isError: isErrorContractUserData,
  } = useFetchContractUserData({
    version: '0.1.0',
    userAdress: session?.user?.address,
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
    enabled: !!session?.user?.address,
  })

  /** Fetch the overall mint-related data from Contract */
  const {
    data: fetchedContractData,
    isLoading: isLoadingContractData,
    isError: isErrorContractData,
  } = useFetchContractData({
    version: '0.1.0',
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
  })

  /** @todo presale mint list */
  const userMintLeft =
    type === SalePhaseEnum.enum.Presale
      ? fetchedContractData?.maxAllocation.sub(fetchedContractUserData?.userMintCount || 0) || BigNumber.from(0)
      : type === SalePhaseEnum.enum.Public
      ? fetchedContractData?.maxAllocation.sub(fetchedContractUserData?.userMintCount || 0) || BigNumber.from(0)
      : BigNumber.from(0)

  return {
    data: {
      ...fetchedContractData,
      ...fetchedContractUserData,
      userMintLeft,
      // cases handled:
      // 1. maxAllocation more than 0
      // 2. totalMinted less than collectionSize
      // 3. userMintCount less than maxAllocation
      // 4. collectionMintLeft more than 0
      allowToMint:
        fetchedContractData?.maxAllocation.gt(0) &&
        fetchedContractData?.totalMinted.lt(fetchedContractData?.collectionSize) &&
        fetchedContractUserData?.userMintCount.lt(fetchedContractData.maxAllocation) &&
        fetchedContractData.collectionMintLeft.gt(0), // @todo check boundary cases
      // cases handled:
      // 1. maxAllocation more than 0
      // 2. userMintCount less than maxAllocation
      hasMintAllocation:
        fetchedContractUserData?.userMintCount &&
        fetchedContractData?.maxAllocation.gt(0) &&
        fetchedContractUserData?.userMintCount.lt(fetchedContractData.maxAllocation),
      userBalance: userBalance,
    },
    isError: isErrorContractData || isErrorContractUserData,
    isLoading: isLoadingContractData || isLoadingContractUserData,
  }
}
