import type { RepositoryContractDeployment } from '@prisma/client'
import { BigNumber } from 'ethers'
import { COLLECTION_DISTRIBUTION, RhapsodyContractConfig } from 'src/client/utils/constant'
import type { ContractData } from 'src/pages/[address]'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { useNotification } from './useNotification'
// import { useNotification } from './useNotificationV1'

interface UsePublicMint {
  isLoading: boolean
  write: () => void
  isError: boolean
  isProcessing: boolean
}

export const usePublicMint = ({
  invocations,
  contractData,
  contractDeployment,
}: {
  address: string | undefined | null
  invocations: BigNumber
  contractData: ContractData
  contractDeployment: RepositoryContractDeployment
}): UsePublicMint => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()

  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContractConfig.contractInterface,
    functionName: 'publicMint',
    args: [invocations],
    overrides: {
      value: BigNumber.from(contractData.mintPrice).mul(invocations),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
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
        notifyInfo(`A transaction with hash ${data.hash} has been submitted. Please wait for confirmation.`)
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

  // const mint = (invocations: BigNumber) => {
  //   if (!address) {
  //     return notifyError('Please connect to wallet first.')
  //   }

  //   if (BigNumber.from(invocations).gt(BigNumber.from(maxAllocation))) {
  //     return notifyError('Trying to mint too many')
  //   }

  //   console.log(write)

  //   if (!write) {
  //     return notifyError('Something wrong with the contract. Please try again...')
  //   }

  //   write?.({
  //     recklesslySetUnpreparedArgs: [invocations],
  //     recklesslySetUnpreparedOverrides: {
  //       value: BigNumber.from(contractData.mintPrice).mul(invocations),
  //       gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
  //     },
  //   })
  // }

  return {
    // isLoading: isLoading || trxIsProcessing,
    write: () => write?.(),
    isLoading,
    isError,
    isProcessing,
  }
}
