import ModalComponent from '@components/Layout/Modal'
import { LayerElement } from '@prisma/client'
import { FC } from 'react'
import { useMutateReorderLayers } from './layer-reorder-confirm-mutate-hook'

interface Props {
  onClose: () => void
  visible: boolean
  layerElements: LayerElement[]
}

const LayerElementReorderConfirmModal: FC<Props> = ({ visible, onClose, layerElements }: Props) => {
  const { mutate, isLoading } = useMutateReorderLayers()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Reorder Layers'
      description={`You are reordering the layers. This will be applied to all collections in the project`}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
        mutate({ layerElementOrder: layerElements.map(({ id }) => id) }, { onSettled: onClose })
      }}
    />
  )
}

export default LayerElementReorderConfirmModal
