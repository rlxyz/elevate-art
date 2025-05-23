import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment } from '@prisma/client'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { formatEthereumHash } from '@utils/ethers'
import { BigNumber } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { useSaleMintCountInput } from './useSaleMintCountInput'
import { useUserMerkleProof } from './useUserMerkleProof'

export interface InteractWithContract {
  isLoading: boolean
  write: () => void
  isError: boolean
  isProcessing: boolean
}

interface UsePresaleMint extends InteractWithContract {
  mintCount: BigNumber
  setMintCount: Dispatch<SetStateAction<BigNumber>>
}

export const usePresalePurchase = ({
  contractData,
  contractDeployment,
  enabled,
}: {
  address: string | undefined | null
  enabled: boolean
  contractData: RhapsodyContractData
  contractDeployment: ContractDeployment
}): UsePresaleMint => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()
  const { mintCount, setMintCount } = useSaleMintCountInput({ enabled })
  const {
    proof,
    maxMintForUser,
    enabled: proofEnabled,
  } = useUserMerkleProof({
    type: ContractDeploymentAllowlistType.PRESALE,
  })

  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContract.abi,
    functionName: 'presaleMint',
    args: [mintCount, maxMintForUser, proof],
    enabled: enabled && proofEnabled,
    overrides: {
      value: BigNumber.from(contractData.presalePeriod.mintPrice).mul(mintCount),
      gasLimit: BigNumber.from(200000),
    },
  })

  const {
    data: transaction,
    isLoading,
    isError,
    write,
  } = useContractWrite({
    ...config,
    onSettled: (data) => {
      if (data) {
        notifyInfo(`A transaction with hash ${formatEthereumHash(data.hash)} has been submitted. Please wait for confirmation.`)
      }
    },
    onError: (error) => {
      if (error.message.startsWith('user rejected transaction')) {
        return notifyError('You have rejected the transaction.')
      }

      notifyError(
        "Something went wrong. Please try again later. If the problem persists, please contact us on Discord. We're sorry for the inconvenience."
      )
    },
  })

  // /** @todo clean this up */
  const { isLoading: isProcessing } = useWaitForTransaction({
    hash: transaction?.hash,
    onError: (error) => {
      notifyError(
        "Something went wrong. Please try again later. If the problem persists, please contact us on Discord. We're sorry for the inconvenience."
      )
    },
    onSuccess: (data) => {
      if (data) {
        notifySuccess("You've successfully minted your NFTs!")
      }
    },
  })

  return {
    mintCount,
    setMintCount,
    write: () => write?.(),
    isLoading,
    isError,
    isProcessing,
  }
}
