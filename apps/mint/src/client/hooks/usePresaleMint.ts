import { ethers } from 'ethers'
import { config } from 'src/client/utils/config'
import { COLLECTION_DISTRIBUTION, RhapsodyContractConfig } from 'src/client/utils/constant'
import { generateLeaf, presaleMerkleTree } from 'src/client/utils/merkle_roots'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

import { usePresaleMaxAllocation } from './contractsRead'
import { useNotification } from './useNotification'
import { useQueryContractDeployment } from './useQueryContractDeployment'

interface UsePresaleMint {
  isLoading: boolean
  mint: (invocation: number) => void
  isError: boolean
}

export const usePresaleMint = ({ address }: { address: `0x${string}` | undefined }): UsePresaleMint => {
  const { current } = useQueryContractDeployment()
  const { notifyError, notifySubmitted, notifySuccess } = useNotification(current?.deployment?.repository.name || '')
  const maxInvocation = usePresaleMaxAllocation({ address })
  const {
    write,
    isLoading: contractIsLoading,
    data: trx,
    isError,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...RhapsodyContractConfig,
    functionName: 'presaleMint',
    onSettled: (data) => {
      if (data) {
        notifySubmitted(data?.hash)
      }
    },
    onError: (error) => {
      // @ts-expect-error may not be needed to construct a custom type for error
      notifyError({ message: error?.data?.message ?? error?.message })
    },
  })
  const { isLoading: trxIsProcessing } = useWaitForTransaction({
    hash: trx?.hash,
    onError: (error) => {
      // @ts-expect-error may not be needed to construct a custom type for error
      notifyError({ message: error?.data?.message ?? error?.message })
    },
    onSuccess: (data) => {
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
    const formattedAddress = ethers.utils.getAddress(address)
    const overrides = {
      value: ethers.utils.parseEther(mintValue.toString()),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    }

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(formattedAddress, maxInvocation.toString())

    // Generate airdrop proof
    const proof: string[] = presaleMerkleTree.getHexProof(leaf)

    write({
      recklesslySetUnpreparedArgs: [invocations, maxInvocation, proof],
      recklesslySetUnpreparedOverrides: overrides,
    })
  }

  return {
    isLoading: contractIsLoading || trxIsProcessing,
    mint,
    isError,
  }
}
