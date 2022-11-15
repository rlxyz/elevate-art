import ModalComponent from '@components/Layout/modal/Modal'
import { LayerElement } from '@prisma/client'
import { FC } from 'react'
import { FormModalProps } from './layer-delete-modal'
import { useMutateReorderLayers } from './layer-reorder-confirm-mutate-hook'

interface LayerElementReorderProps extends FormModalProps {
  layerElements: LayerElement[]
}

const LayerElementReorderConfirmModal: FC<LayerElementReorderProps> = ({ visible, onClose, layerElements }) => {
  const { mutate, isLoading } = useMutateReorderLayers()
  return (
    <ModalComponent
      type='submit'
      visible={visible}
      onClose={onClose}
      title='Reorder Layers'
      description={`You are reordering the layers. This will be applied to all collections in the project`}
      isLoading={isLoading}
      onClick={(e) => {
        mutate({ layerElementOrder: layerElements.map(({ id }) => id) }, { onSettled: onClose })
      }}
    />
  )
}

export default LayerElementReorderConfirmModal
