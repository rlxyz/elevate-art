import ModalComponent from '@components/layout/modal/Modal'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import { Repository } from '@prisma/client'
import clsx from 'clsx'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useMutateCreateLayerElement } from '../../../hooks/mutations/useMutateCreateLayerElement'
import { FormModalProps } from './LayerElementDeleteModal'

export interface LayerElementCreateProps extends FormModalProps {
  repository: Repository
}

export type LayerElementCreateForm = {
  name: string
}

const LayerElementCreateModal: FC<LayerElementCreateProps> = ({ visible, onClose, onSuccess, repository }) => {
  const { mutate, isLoading } = useMutateCreateLayerElement()
  const { all: layers } = useQueryRepositoryLayer()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LayerElementCreateForm>({
    defaultValues: {
      name: '',
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
      onSubmit={handleSubmit((data) => mutate({ repositoryId: repository.id, name: data.name }, { onSuccess: handleSuccess }))}
      title='Add Layer'
      description={`This will create a new layer, you can then upload traits to this layer.`}
      isLoading={isLoading}
    >
      <div className='divide-y divide-mediumGrey space-y-6'>
        <div className='space-y-1 flex flex-col'>
          <span className='text-xs font-base'>Layer Name</span>
          <input
            className={clsx('block text-xs w-full pl-2 rounded-[5px] py-2')}
            type='string'
            {...register('name', {
              required: true,
              maxLength: 20,
              minLength: 3,
              pattern: /^[-/a-z0-9 ]+$/gi,
              validate: (value) => !layers.map((x) => x.name).includes(value),
            })}
          />
          {errors.name && (
            <span className='text-xs text-redError'>
              {errors.name.type === 'required'
                ? 'This field is required'
                : errors.name.type === 'pattern'
                ? 'We only accept - and / for special characters'
                : errors.name.type === 'validate'
                ? 'A layer with this name already exists'
                : 'Must be between 3 and 20 characters long'}
            </span>
          )}
        </div>
      </div>
    </ModalComponent>
  )
}

export default LayerElementCreateModal
