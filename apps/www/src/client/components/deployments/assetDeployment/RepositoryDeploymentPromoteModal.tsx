import type { FormModalProps } from '@components/create/repository/LayerElementFileTree/LayerElementDeleteModal'
import { useMutateRepositoryDeploymentPromote } from '@hooks/trpc/repositoryDeployment/useMutateRepositoryDeploymentPromote'
import type { AssetDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import type { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { toPascalCaseWithSpace } from 'src/client/utils/format'

export interface RepositoryDeploymentDeleteProps extends FormModalProps {
  deployment: AssetDeployment
}

const RepositoryDeploymentPromoteModal: FC<RepositoryDeploymentDeleteProps> = ({ visible, onClose, onSuccess, deployment }) => {
  const { mutate, isLoading } = useMutateRepositoryDeploymentPromote()

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
      title='Promote Deployment'
      description={
        <>
          You promoting an existing deployment to a <strong>{toPascalCaseWithSpace(AssetDeploymentBranch.PRODUCTION)}</strong> deployment.
          This will it live and available to the public. <br />
          <br />
          If you have an existing {toPascalCaseWithSpace(AssetDeploymentBranch.PRODUCTION)} deployment, it will be replaced with this one.
        </>
      }
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    />
  )
}

export default RepositoryDeploymentPromoteModal
