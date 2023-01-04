import type { FormModalProps } from '@components/create/repository/LayerElementFileTree/LayerElementDeleteModal'
import { ContractFormBodyRadioInput, ContractFormBodySelectInput } from '@components/deployments/contractDeployment/ContractForm'
import { useMutateRepositoryDeploymentCreate } from '@hooks/trpc/repositoryDeployment/useMutateRepositoryDeploymentCreate'
import type { Collection, Repository } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface RepositoryDeploymentCreateProps extends FormModalProps {
  repository: Repository
  collections: Collection[]
}

export type LayerElementCreateForm = {
  collectionName: string
  mintType: AssetDeploymentType
}

const RepositoryDeploymentCreateModal: FC<RepositoryDeploymentCreateProps> = ({ visible, onClose, onSuccess, collections, repository }) => {
  const { mutate, isLoading } = useMutateRepositoryDeploymentCreate()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<LayerElementCreateForm>({
    defaultValues: {
      collectionName: 'main',
      mintType: AssetDeploymentType.BASIC,
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
        mutate({ repositoryId: repository.id, collectionId: collection.id, type: data.mintType }, { onSuccess: handleSuccess })
      })}
      title='New Deployment'
      description={`You can create new deployments of existing collections. This will a copy of the layer, traits and rules associated to the collection selected. Select one from below.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    >
      <ContractFormBodySelectInput
        defaultValue={getValues('collectionName')}
        {...register('collectionName')}
        label={'Name'}
        description={'Select a deployment collection'}
        className='col-span-6'
      >
        {collections?.map((collection) => (
          <option key={collection.id} value={collection.name}>
            {collection.name}
          </option>
        ))}
      </ContractFormBodySelectInput>

      <div className='col-span-3 flex flex-col'>
        <label className='text-xs font-semibold'>Mint Type</label>
        <div className='flex space-x-3'>
          <div className='h-full flex items-center space-x-2'>
            <ContractFormBodyRadioInput
              {...register('mintType', {
                onChange: (e) => {
                  setValue('mintType', AssetDeploymentType.BASIC)
                },
              })}
              label={'Off-Chain'}
            />
          </div>
          <div className='h-full flex items-center space-x-2'>
            <ContractFormBodyRadioInput
              {...register('mintType', {
                onChange: (e) => {
                  setValue('mintType', AssetDeploymentType.GENERATIVE)
                },
              })}
              label={'On-Chain'}
            />
          </div>
        </div>
        <p className='text-[0.6rem] text-darkGrey'>Select the type of mint for the art generation of this collection.</p>
      </div>
    </ModalComponent>
  )
}

export default RepositoryDeploymentCreateModal
