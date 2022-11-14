import ModalComponent from '@components/Layout/Modal'
import { LayerElement } from '@prisma/client'
import { FC } from 'react'
import { useMutateDeleteLayerElement } from './layer-delete-modal-hook'

interface Props {
  onSuccess: () => void
  onClose: () => void
  visible: boolean
  layerElement: LayerElement
}

const LayerElementDeleteModal: FC<Props> = ({ layerElement, visible, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateDeleteLayerElement()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      onClick={() =>
        mutate(
          {
            layerElementId: layerElement.id,
            repositoryId: layerElement.repositoryId,
          },
          { onSuccess }
        )
      }
      title={`Delete Layer`}
      description={`This will delete an existing layer, you can't revert this action.`}
      isLoading={isLoading}
      data={[{ label: 'Name', value: layerElement.name }]}
    />
  )
}

export default LayerElementDeleteModal
