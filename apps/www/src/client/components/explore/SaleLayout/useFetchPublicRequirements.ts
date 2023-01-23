import type { ContractDeployment } from '@prisma/client'
import { BigNumber } from 'ethers'
import type { Session } from 'next-auth'
import { useBalance } from 'wagmi'
import { useFetchContractData, useFetchContractUserData } from './useFetchContractData'

export const useFetchPublicRequirements = ({
  session,
  contractDeployment,
}: {
  session: Session | null
  contractDeployment: ContractDeployment
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

  // mint allocation
  const publicMintMx = BigNumber.from(fetchedContractData?.maxMintPerAddress || 0)
  const publicMintLeft = publicMintMx.sub(fetchedContractUserData?.userMintCount || 0)

  // total left in collection
  const collectionMintMax = BigNumber.from(fetchedContractData?.collectionSize || 0)
  const collectionMintLeft = collectionMintMax.sub(fetchedContractData?.totalSupply || 0)

  // user left after total left
  const userMintLeft = publicMintLeft.gt(collectionMintLeft) ? collectionMintLeft : publicMintLeft

  return {
    data: {
      ...fetchedContractData,
      ...fetchedContractUserData,
      userMintLeft,
      allowToMint: userMintLeft.gt(0),
      userBalance: userBalance,
    },
    isError: isErrorContractData || isErrorContractUserData,
    isLoading: isLoadingContractData || isLoadingContractUserData,
  }
}
