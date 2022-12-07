import { useMutateRepositoryCreateDeploymentCreate } from '@hooks/trpc/repositoryContractDeployment/useMutateRepositoryContractDeploymentCreate'
import { RepositoryDeployment } from '@prisma/client'
import { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { FormModalProps } from '../LayerElementFileTree/LayerElementDeleteModal'

export interface RepositoryContractDeploymentCreateProps extends FormModalProps {
  deployment: RepositoryDeployment
}

const RepositoryContractDeploymentCreateModal: FC<RepositoryContractDeploymentCreateProps> = ({
  visible,
  onClose,
  onSuccess,
  deployment,
}) => {
  const { mutate, isLoading } = useMutateRepositoryCreateDeploymentCreate()

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
      onClick={(e) => {
        e.preventDefault()
        mutate({ deploymentId: deployment.id }, { onSuccess: handleSuccess })
      }}
      title='Create Contract'
      description={`You are creating a contract based on this deployment.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    >
      {/** Write form here.... contract namee, total supply, mint info..... */}
    </ModalComponent>
  )
}

export default RepositoryContractDeploymentCreateModal
