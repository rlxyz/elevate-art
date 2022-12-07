import { useMutateRepositoryDeploymentDelete } from '@hooks/trpc/repository/useMutateRepositoryDeploymentDelete'
import { RepositoryDeployment } from '@prisma/client'
import { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { FormModalProps } from '../LayerElementFileTree/LayerElementDeleteModal'

export interface RepositoryDeploymentDeleteProps extends FormModalProps {
  deployment: RepositoryDeployment
}

const RepositoryDeploymentDeleteModal: FC<RepositoryDeploymentDeleteProps> = ({ visible, onClose, onSuccess, deployment }) => {
  const { mutate, isLoading } = useMutateRepositoryDeploymentDelete()

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
      title='Delete Deployment'
      description={`You are deleting an existing deployment of existing collections. This cannot be undone.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    />
  )
}

export default RepositoryDeploymentDeleteModal
