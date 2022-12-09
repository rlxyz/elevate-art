import { ethers } from 'ethers'
import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'
import { config } from 'src/client/utils/config'
import {
  COLLECTION_DISTRIBUTION,
  RhapsodyContractConfig,
} from 'src/client/utils/constant'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { usePublicSaleMaxAllocation } from './contractsRead'
import { useNotification } from './useNotification'

interface UsePublicMint {
  isLoading: boolean
  mint: (invocation: number) => void
  isError: boolean
}

export const usePublicMint = (address: string): UsePublicMint => {
  const { data } = useGetProjectDetail('rlxyz')
  const { notifyError, notifySubmitted, notifySuccess } = useNotification(
    data?.projectName,
  )
  const maxInvocation = usePublicSaleMaxAllocation(address)
  const {
    write,
    isLoading: contractIsLoading,
    data: trx,
    isError,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
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
      return notifyError({ message: 'Please connect to wallet first.' })
    }

    if (invocations > maxInvocation) {
      return notifyError({ message: 'Trying to mint too many' })
    }

    const mintValue = config.totalPriceAllocation[invocations - 1]
    const overrides = {
      value: ethers.utils.parseEther(mintValue.toString()),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    }

    write({
      recklesslySetUnpreparedArgs: [invocations],
      recklesslySetUnpreparedOverrides: overrides,
    })
  }

  return {
    isLoading: contractIsLoading || trxIsProcessing,
    mint,
    isError,
  }
}
