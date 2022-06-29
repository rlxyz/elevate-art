import { config } from '@utils/config'
import { COLLECTION_DISTRIBUTION, RhapsodyContractConfig } from '@utils/constant'
import { ethers } from 'ethers'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { usePresaleMaxAllocation } from './contractsRead'
import { useNotification } from './useNotification'

interface UsePublicMint {
  isLoading: boolean
  mint: (invocation: number) => void
}

export const usePublicMint = (address: string): UsePublicMint => {
  const { notifyError, notifySubmitted, notifySuccess } = useNotification()
  const maxInvocation = usePresaleMaxAllocation(address)
  const {
    write,
    isLoading: contractIsLoading,
    data: trx,
  } = useContractWrite({
    ...RhapsodyContractConfig,
    functionName: 'publicMint',
    onSettled: data => {
      if (data) {
        notifySubmitted(data?.hash)
      }
    },
    onError: error => {
      // @ts-expect-error may not be needed to construct a custom type for error
      notifyError({ message: error?.data?.message ?? error?.message })
    },
  })
  const { isLoading: trxIsProcessing } = useWaitForTransaction({
    hash: trx?.hash,
    onError: error => {
      // @ts-expect-error may not be needed to construct a custom type for error
      notifyError({ message: error?.data?.message ?? error?.message })
    },
    onSuccess: data => {
      if (data) {
        notifySuccess()
      }
    },
  })

  const mint = (invocations: number) => {
    if (!address) {
      notifyError({ message: 'Please connect to wallet first.' })
    }

    if (invocations > maxInvocation) {
      notifyError({ message: 'Trying to mint too many' })
    }

    const mintValue = config.totalPriceAllocation[invocations - 1]
    const overrides = {
      value: ethers.utils.parseEther(mintValue.toString()),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    }

    write({ args: [invocations], overrides })
  }

  return {
    isLoading: contractIsLoading || trxIsProcessing,
    mint,
  }
}
