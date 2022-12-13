import type { FormModalProps } from '@components/repository/LayerElementFileTree/LayerElementDeleteModal'
import { useMutateRepositoryDeploymentCreate } from '@hooks/trpc/repositoryDeployment/useMutateRepositoryDeploymentCreate'
import type { Collection, Repository } from '@prisma/client'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface RepositoryDeploymentCreateProps extends FormModalProps {
  repository: Repository
  collections: Collection[]
}

export type LayerElementCreateForm = {
  collectionName: string
}

const RepositoryDeploymentCreateModal: FC<RepositoryDeploymentCreateProps> = ({ visible, onClose, onSuccess, collections, repository }) => {
  const { mutate, isLoading } = useMutateRepositoryDeploymentCreate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LayerElementCreateForm>({
    defaultValues: {
      collectionName: collections[0]?.name || '',
    },
  })

  const handleClose = () => {
    reset()
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
      onSubmit={handleSubmit((data) => {
        const collection = collections.find((x) => x.name === data.collectionName)
        if (!collection) return
        mutate({ repositoryId: repository.id, collectionId: collection.id }, { onSuccess: handleSuccess })
      })}
      title='New Deployment'
      description={`You can create new deployments of existing collections. This will a copy of the layer, traits and rules associated to the collection selected. Select one from below.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    >
      <select {...register('collectionName', { required: true })} className='text-xs p-2 w-full rounded-[5px] border border-mediumGrey'>
        {collections?.map((collection) => (
          <option key={collection.id} value={collection.name}>
            {collection.name}
          </option>
        ))}
      </select>
    </ModalComponent>
  )
}

export default RepositoryDeploymentCreateModal
