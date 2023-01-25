import type { ContractDeployment } from '@prisma/client'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import { BigNumber } from 'ethers'
import type { Session } from 'next-auth'
import { useBalance } from 'wagmi'
import { useFetchContractData, useFetchContractUserData } from './useFetchContractData'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'
import { useUserMerkleProof } from './useUserMerkleProof'

export const useFetchClaimRequirements = ({
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

  const usersMintLeft = () => {
    const totalMintLeft = BigNumber.from(currentContractDeploymentWhitelist?.mint || 0).sub(
      BigNumber.from(fetchedContractUserData?.userMintCount || 0)
    )

    /**
     * If the total mint left is less than or equal to 0, the user cannot mint anymore.
     */
    if (totalMintLeft.lte(0)) return BigNumber.from(0)
    if (BigNumber.from(maxMintPerAddress).eq(0)) return BigNumber.from(0)
    if (BigNumber.from(maxMintPerAddress).eq(BigNumber.from(fetchedContractUserData?.userMintCount || 0))) return BigNumber.from(0)

    /**
     * Basically, user can only max mint up to the max mint per address.
     * And this handles the cases where if the total mint left is greater than the max mint per
     * address, the user will only be able to mint up to the max mint per address.
     */
    if (totalMintLeft.gt(BigNumber.from(maxMintPerAddress))) {
      return BigNumber.from(maxMintPerAddress)
    } else {
      return totalMintLeft
    }
  }

  const userMintLeftBasedOnCollectionSize = () => {
    const mintLeft = usersMintLeft()

    /**
     * The collection also has an upper boundary defined by the collection size.
     * It also has a variable that tracks the current minted supply, called totalSupply.
     */
    const collectionLeft = BigNumber.from(collectionSize || 0).sub(BigNumber.from(fetchedContractData?.totalSupply || 0))

    /**
     * If the collection left is less than or equal to 0, the user cannot mint anymore.
     * This is because the collection is already full.
     * This is also the case where the user has already minted the max mint per address.
     * This is because the user can only mint up to the max mint per address.
     */
    if (collectionLeft.lte(0)) return BigNumber.from(0)

    /**
     * If the collection left is less than the mint left, the user can only mint up to the collection left.
     * This is because the collection is already full.
     */
    if (collectionLeft.lt(mintLeft)) {
      return collectionLeft
    }

    /**
     * If the collection left is greater than or equal to the mint left, the user can only mint up to the mint left.
     */
    if (collectionLeft.gte(mintLeft)) {
      return mintLeft
    }

    return BigNumber.from(0)
  }

  const {
    current: currentContractDeploymentWhitelist,
    isLoading: isLoadingContractDeploymentWhitelist,
    isError: isErrorContractDeploymentWhitelist,
  } = useQueryContractDeploymentWhitelistFindClaimByAddress({
    type: ContractDeploymentAllowlistType.CLAIM,
  })

  const { root, proof } = useUserMerkleProof({ type: ContractDeploymentAllowlistType.CLAIM })
  const { collectionSize, maxMintPerAddress, totalSupply } = fetchedContractData
  const { claimTime } = fetchedContractData

  return {
    data: {
      ...fetchedContractData,
      ...fetchedContractUserData,
      userMintLeft: userMintLeftBasedOnCollectionSize(),
      allowToMint:
        claimTime &&
        root &&
        proof &&
        root === fetchedContractData?.claimMerkleRoot &&
        userMintLeftBasedOnCollectionSize().gt(0) &&
        claimTime?.getTime() < new Date().getTime(),
      userBalance: userBalance,
    },
    isError: isErrorContractData || isErrorContractUserData || isErrorContractDeploymentWhitelist,
    isLoading: isLoadingContractData || isLoadingContractUserData || isLoadingContractDeploymentWhitelist,
  }
}
