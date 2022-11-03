import ModalComponent from '@components/Layout/Modal'
import { FC } from 'react'
import Upload from '../upload-new-traits'
import { useMutateCreateLayerElement } from './layer-create-modal-hook'

interface Props {
  onClose: () => void
  visible: boolean
}

const LayerElementCreateModal: FC<Props> = ({ visible, onClose }) => {
  const { mutate, isLoading } = useMutateCreateLayerElement()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Add Layer'
      description={`You can upload a layer folder here. This will be applied to all collections in the project.`}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
        onClose()
      }}
      className='md:max-w-2xl' // @todo fix this
    >
      <Upload className='h-[30vh]' depth={2} onDropCallback={mutate} gridSize='md' />
    </ModalComponent>
  )
}

export default LayerElementCreateModal
