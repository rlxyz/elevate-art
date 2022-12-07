import { useMutateRepositoryCreateBucket } from '@hooks/trpc/repository/useMutateRepositoryCreateBucket'
import { Repository } from '@prisma/client'
import { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { FormModalProps } from '../LayerElementFileTree/LayerElementDeleteModal'

export interface RepositoryDeploymentCreateProps extends FormModalProps {
  repository: Repository
}

const RepositoryDeploymentBucketCreateModal: FC<RepositoryDeploymentCreateProps> = ({ visible, onClose, onSuccess, repository }) => {
  const { mutate, isLoading } = useMutateRepositoryCreateBucket()

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
        mutate({ repositoryId: repository.id }, { onSuccess: handleSuccess })
      }}
      title='Setup Deployment'
      // @todo fix this
      description={`Before you can start deploying, we need to setup your deployment instance. Note, that this may take a few minutes.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    />
  )
}

export default RepositoryDeploymentBucketCreateModal
