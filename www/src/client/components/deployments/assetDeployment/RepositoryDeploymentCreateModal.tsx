import type { FormModalProps } from '@components/create/repository/LayerElementFileTree/LayerElementDeleteModal'
import { FormRadioInput } from '@components/layout/form/FormRadioInput'
import { FormSelectInput } from '@components/layout/form/FormSelectInput'
import ModalComponent from '@components/layout/modal/Modal'
import { useMutateRepositoryDeploymentCreate } from '@hooks/trpc/repositoryDeployment/useMutateRepositoryDeploymentCreate'
import type { Collection, Repository } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'

export interface RepositoryDeploymentCreateProps extends FormModalProps {
  repository: Repository
  collections: Collection[]
}

export type LayerElementCreateForm = {
  name: string
  mintType: AssetDeploymentType
}

const RepositoryDeploymentCreateModal: FC<RepositoryDeploymentCreateProps> = ({ visible, onClose, onSuccess, collections, repository }) => {
  const { mutate, isLoading } = useMutateRepositoryDeploymentCreate()
  const { register, getValues, handleSubmit, setValue, reset } = useForm<LayerElementCreateForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: collections.length > 0 ? collections[0]?.name || 'main' : 'main',
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
        const collection = collections?.find((x) => x.name === data.name)
        if (!collection) return
        mutate({ repositoryId: repository.id, collectionId: collection.id, type: data.mintType }, { onSuccess: handleSuccess })
      })}
      title='New Deployment'
      description={`You can create new deployments of existing collections. This will a copy of the layer, traits and rules associated to the collection selected. Select one from below.`}
      isLoading={isLoading}
      className='md:max-w-lg' // @todo fix this
    >
      {/* <DevTool control={control} /> */}
      <FormSelectInput
        {...register('name', {
          onChange: (e) => {
            setValue('name', e.target.value)
          },
        })}
        label={'Name'}
        description={'Select a deployment collection'}
        defaultValue={getValues('name')}
        className='col-span-6'
      >
        {collections?.map((collection) => (
          <option key={collection.id} value={collection.name}>
            {collection.name}
          </option>
        ))}
      </FormSelectInput>

      <div className='col-span-3 flex flex-col'>
        <label className='text-xs font-semibold'>Mint Type</label>
        <div className='flex space-x-3'>
          <div className='h-full flex items-center space-x-2'>
            <FormRadioInput
              {...register('mintType', {
                onChange: (e) => {
                  setValue('mintType', e.target.value as AssetDeploymentType)
                },
              })}
              label={'Off-Chain'}
              value={AssetDeploymentType.BASIC}
            />
          </div>
          <div className='h-full flex items-center space-x-2'>
            <FormRadioInput
              {...register('mintType', {
                onChange: (e) => {
                  setValue('mintType', e.target.value as AssetDeploymentType)
                },
              })}
              label={'On-Chain'}
              value={AssetDeploymentType.GENERATIVE}
            />
          </div>
        </div>
        <span className='text-[0.6rem] text-darkGrey'>Select the type of mint for the art generation of this collection.</span>
      </div>
    </ModalComponent>
  )
}

export default RepositoryDeploymentCreateModal
