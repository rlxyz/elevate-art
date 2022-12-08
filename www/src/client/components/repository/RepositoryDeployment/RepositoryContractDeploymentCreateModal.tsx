import { useMutateRepositoryCreateDeploymentCreate } from '@hooks/trpc/repositoryContractDeployment/useMutateRepositoryContractDeploymentCreate'
import type { RepositoryContractDeployment } from '@prisma/client'
import { parseEther } from 'ethers/lib/utils.js'
import type { FC } from 'react'
import { useState } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useDeployContract } from '../../../hooks/utils/useDeployContract'
import type { FormModalProps } from '../LayerElementFileTree/LayerElementDeleteModal'

export interface RepositoryContractDeploymentCreateProps extends FormModalProps {
  contractDeployment: RepositoryContractDeployment
}

const RepositoryContractDeploymentCreateModal: FC<RepositoryContractDeploymentCreateProps> = ({
  visible,
  onClose,
  onSuccess,
  contractDeployment,
}) => {
  const { mutate } = useMutateRepositoryCreateDeploymentCreate()
  const { deploy, address: contractAddress } = useDeployContract()
  const [to, setTo] = useState('')
  const [debouncedTo] = useDebounce(to, 500)

  const [amount, setAmount] = useState('')
  const [debouncedAmount] = useDebounce(amount, 500)

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  })

  const { data, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleClose = () => {
    onClose()
  }

  const handleSuccess = () => {
    onSuccess && onSuccess()
    handleClose()
  }

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      onSubmit={async (e) => {
        e.preventDefault()
        try {
          await deploy({
            name: 'test-deployment-contract',
            symbol: 'EA-TDC',
            collectionSize: 10000,
            maxPublicBatchPerAddress: 5,
            amountForPromotion: 10,
            mintPrice: '333000000000000000',
          })
        } catch (error) {
          console.error('err', error)
        }
      }}
      title='Create Contract'
      description={`You are creating a contract based on this deployment.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    >
      {/* <button disabled={isLoading || !sendTransaction || !to || !amount}>{isLoading ? 'Sending...' : 'Send'}</button> */}
      {/* Successfully deploy contract {contractAddress} */}
      {/* {isSuccess && (
        <div>
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )} */}
      {/** Write form here.... contract namee, total supply, mint info..... */}
    </ModalComponent>
  )
}

export default RepositoryContractDeploymentCreateModal
