import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { formatEthereumHash } from '@utils/ethers'
import { BigNumber } from 'ethers'
import { getSyncedBaseURI } from 'src/client/utils/image'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useUpdateBaseURI = ({ contractDeployment }: { enabled: boolean; contractDeployment: ContractDeployment }) => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()

  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContract.abi,
    functionName: 'setBaseURI',
    args: [getSyncedBaseURI({ contractDeployment })],
    overrides: { gasLimit: BigNumber.from(150000) },
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
        notifySuccess("You've successfully updated the tokens baseURI!")
      }
    },
  })

  return {
    write: () => write?.(),
    isLoading,
    isError,
    isProcessing,
  }
}
