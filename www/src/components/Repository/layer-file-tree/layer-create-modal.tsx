import ModalComponent from '@components/Layout/Modal'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import clsx from 'clsx'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useMutateCreateLayerElement } from './layer-create-modal-hook'

interface Props {
  onClose: () => void
  visible: boolean
}

const LayerElementCreateModal: FC<Props> = ({ visible, onClose }) => {
  const { mutate, isLoading } = useMutateCreateLayerElement()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  })

  return (
    <ModalComponent
      visible={visible}
      onClose={() => {
        reset()
        onClose()
      }}
      title='Add Layer'
      description={`This will create a new layer, you can then upload traits to this layer.`}
      isLoading={isLoading}
    >
      <form
        onSubmit={handleSubmit((data) =>
          mutate({
            repositoryId,
            name: data.name,
          })
        )}
      >
        <div className='divide-y divide-mediumGrey space-y-6'>
          <div className='space-y-1 flex flex-col'>
            <span className='text-xs font-base'>Layer Name</span>
            <input
              className={clsx('block text-xs w-full pl-2 rounded-[5px] py-2')}
              type='string'
              {...register('name', { required: true, maxLength: 20, minLength: 3, pattern: /^[-/a-z0-9]+$/gi })}
            />
            {errors.name && (
              <span className='text-xs text-redError'>
                {errors.name.type === 'required'
                  ? 'This field is required'
                  : errors.name.type === 'pattern'
                  ? 'We only accept - and / for special characters'
                  : 'Must be between 3 and 20 characters long'}
              </span>
            )}
          </div>
        </div>
      </form>
    </ModalComponent>
  )
}

export default LayerElementCreateModal
