import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { formatEthereumHash } from '@utils/ethers'
import { BigNumber } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useSetMintTimeInput } from './useSetMintTimeInput'

interface UseSetMintTime {
  isLoading: boolean
  write: () => void
  isError: boolean
  isProcessing: boolean
  mintTime: Date
  setMintTime: Dispatch<SetStateAction<Date>>
}

export const useSetMintTime = ({
  contractDeployment,
  currentTime,
  enabled,
  functionName,
}: {
  address: string | undefined | null
  enabled: boolean
  currentTime: Date
  contractDeployment: ContractDeployment
  functionName: 'setClaimTime' | 'setPresaleTime' | 'setPublicTime'
}): UseSetMintTime => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()
  const { mintTime, setMintTime } = useSetMintTimeInput({ enabled, currentTime })

  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContract.abi,
    functionName,
    args: [mintTime],
    overrides: { gasLimit: BigNumber.from(200000) },
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

  // /** @todo clean this up, also not working... */
  const { isLoading: isProcessing } = useWaitForTransaction({
    hash: transaction?.hash,
    onError: (error) => {
      notifyError(
        "Something went wrong. Please try again later. If the problem persists, please contact us on Discord. We're sorry for the inconvenience."
      )
    },
    onSuccess: (data) => {
      if (data) {
        notifySuccess("You've successfully changed the contract mint timestamp")
      }
    },
  })

  return {
    mintTime,
    setMintTime,
    write: () => write?.(),
    isLoading,
    isError,
    isProcessing,
  }
}
