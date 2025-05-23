import { useChangeNetwork } from '@hooks/utils/useChangeNetwork'
import { useNotification } from '@hooks/utils/useNotification'
import type { ContractDeployment } from '@prisma/client'
import RhapsodyContract from '@utils/contracts/RhapsodyCreatorBasic.json'
import { formatEthereumHash } from '@utils/ethers'
import { BigNumber } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { useSaleMintCountInput } from './useSaleMintCountInput'

interface UsePublicMint {
  isLoading: boolean
  write: () => void
  isError: boolean
  isProcessing: boolean
  mintCount: BigNumber
  setMintCount: Dispatch<SetStateAction<BigNumber>>
}

export const usePublicPurchase = ({
  contractData,
  contractDeployment,
  enabled,
}: {
  address: string | undefined | null
  enabled: boolean
  contractData: RhapsodyContractData
  contractDeployment: ContractDeployment
}): UsePublicMint => {
  const { notifyError, notifyInfo, notifySuccess } = useNotification()
  const { mintCount, setMintCount } = useSaleMintCountInput({ enabled })
  const { changeNetwork } = useChangeNetwork()
  const { config } = usePrepareContractWrite({
    address: contractDeployment.address,
    chainId: contractDeployment.chainId,
    abi: RhapsodyContract.abi,
    functionName: 'publicMint',
    args: [mintCount],
    overrides: {
      value: BigNumber.from(contractData.publicPeriod.mintPrice).mul(mintCount),
      gasLimit: BigNumber.from(100000).add(BigNumber.from(mintCount).mul(50000)),
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
    onSuccess: (data) => {
      setMintCount(BigNumber.from(1))
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
    write: () => {
      changeNetwork(contractDeployment.chainId)
      write?.()
    },
    isLoading,
    isError,
    isProcessing,
  }
}
