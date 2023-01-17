import { useMutateLayerElementUpdateName } from '@hooks/trpc/layerElement/useMutateLayerElementUpdateName'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { useRepositoryRoute } from 'src/client/hooks/utils/useRepositoryRoute'
import { FormModalProps } from './LayerElementDeleteModal'

interface LayerElementRenameProps extends FormModalProps {
  layerElement: LayerElement
}

export type LayerElementRenameForm = {
  name: string
}

const LayerElementRenameModal: FC<LayerElementRenameProps> = ({ layerElement, visible, onClose }) => {
  const { mutate, isLoading } = useMutateLayerElementUpdateName()
  const { mainRepositoryHref } = useRepositoryRoute()
  const { all: layers } = useQueryLayerElementFindAll()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LayerElementRenameForm>({
    defaultValues: {
      name: layerElement.name,
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSuccess = () => {
    // router.replace(`${mainRepositoryHref}`)
    handleClose()
  }

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      title={`Rename Layer`}
      description={`This will rename an existing layer, you can't revert this action.`}
      isLoading={isLoading}
      onSubmit={handleSubmit((data) => {
        mutate(
          { layerElements: [{ layerElementId: layerElement.id, repositoryId: layerElement.repositoryId, name: data.name }] },
          { onSuccess: handleSuccess }
        )
      })}
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
              pattern: /^[a-zA-Z0-9-]+$/,
              validate: (value) => !layers.map((x) => x.name).includes(value),
            })}
            defaultValue={layerElement.name}
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

export default LayerElementRenameModal
