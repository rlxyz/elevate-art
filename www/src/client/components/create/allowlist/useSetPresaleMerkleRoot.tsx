import type { InteractWithContract } from '@components/explore/SaleLayout/usePresalePurchase'
import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment, Whitelist } from '@prisma/client'
import { WhitelistType } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import type { Dispatch, SetStateAction } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useSetMerkleRoot } from './useSetMerkleRoot'

interface UseSetPresaleMerkleRoot extends InteractWithContract {
  merkleRoot: string
  setMerkleRoot: Dispatch<SetStateAction<string>>
}

export const useSetPresaleMerkleRoot = ({
  type,
  whitelist,
  contractDeployment,
  enabled,
}: {
  type: WhitelistType
  enabled: boolean
  contractDeployment: ContractDeployment
  whitelist: Whitelist[] | undefined
}): UseSetPresaleMerkleRoot => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()
  const { merkleRoot, setMerkleRoot } = useSetMerkleRoot({ enabled, data: whitelist })
  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContract.abi,
    functionName: type === WhitelistType.ALLOWLIST ? 'setPresaleMerkleRoot' : 'setClaimMerkleRoot',
    args: [merkleRoot],
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
        notifySuccess("You've successfully change the merkle root!")
      }
    },
  })

  return {
    merkleRoot,
    setMerkleRoot,
    write: () => write?.(),
    isLoading,
    isError,
    isProcessing,
  }
}
