import type { ContractDeployment } from '@prisma/client'
import { BigNumber } from 'ethers'
import type { Session } from 'next-auth'
import { useBalance } from 'wagmi'
import { useFetchContractData, useFetchContractUserData } from './useFetchContractData'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const useFetchClaimRequirements = ({
  session,
  contractDeployment,
}: {
  session: Session | null
  contractDeployment: ContractDeployment
}) => {
  /** Fetch User Claim */
  const { current: userClaim } = useQueryContractDeploymentWhitelistFindClaimByAddress()

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

  const {
    current: currentContractDeploymentWhitelist,
    isLoading: isLoadingContractDeploymentWhitelist,
    isError: isErrorContractDeploymentWhitelist,
  } = useQueryContractDeploymentWhitelistFindClaimByAddress()

  return {
    data: {
      ...fetchedContractData,
      ...fetchedContractUserData,
      userMintLeft:
        BigNumber.from(currentContractDeploymentWhitelist?.mint).sub(fetchedContractUserData?.userMintCount || 0) || BigNumber.from(0),
      // cases handled:
      // 1. maxAllocation more than 0
      // 2. totalMinted less than collectionSize
      // 3. userMintCount less than maxAllocation
      // 4. collectionMintLeft more than 0
      allowToMint:
        fetchedContractData?.maxPublicBatchPerAddress?.gt(0) &&
        fetchedContractData?.totalSupply?.lt(fetchedContractData?.collectionSize || BigNumber.from(0)) &&
        fetchedContractUserData?.userMintCount.lt(fetchedContractData?.maxPublicBatchPerAddress) &&
        fetchedContractData.collectionMintLeft.gt(0),

      // cases handled:
      // 1. maxAllocation more than 0
      // 2. userMintCount less than maxAllocation
      hasMintAllocation:
        fetchedContractUserData?.userMintCount &&
        fetchedContractData?.maxPublicBatchPerAddress?.gt(0) &&
        fetchedContractUserData?.userMintCount.lt(fetchedContractData.maxPublicBatchPerAddress),
      userBalance: userBalance,
    },
    isError: isErrorContractData || isErrorContractUserData || isErrorContractDeploymentWhitelist,
    isLoading: isLoadingContractData || isLoadingContractUserData || isLoadingContractDeploymentWhitelist,
  }
}
