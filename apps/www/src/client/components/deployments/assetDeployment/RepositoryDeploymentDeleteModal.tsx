import type { FormModalProps } from '@components/create/repository/LayerElementFileTree/LayerElementDeleteModal'
import { useMutateRepositoryDeploymentDelete } from '@hooks/trpc/repositoryDeployment/useMutateRepositoryDeploymentDelete'
import type { AssetDeployment } from '@prisma/client'
import type { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface RepositoryDeploymentDeleteProps extends FormModalProps {
  deployment: AssetDeployment
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
