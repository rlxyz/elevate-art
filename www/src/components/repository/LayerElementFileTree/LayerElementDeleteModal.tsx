import ModalComponent from '@components/layout/modal/Modal'
import { useMutateDeleteLayerElement } from '@hooks/mutations/useMutateDeleteLayerElement'
import { LayerElement } from '@prisma/client'
import { FC } from 'react'

export interface FormModalProps {
  onSuccess?: () => void
  onError?: () => void
  onClose: () => void
  visible: boolean
}

export interface LayerElementDeleteProps extends FormModalProps {
  layerElement: LayerElement
}

const LayerElementDeleteModal: FC<LayerElementDeleteProps> = ({ layerElement, visible, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateDeleteLayerElement()

  const handleClose = () => {
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
      onClick={() =>
        mutate({ layerElementId: layerElement.id, repositoryId: layerElement.repositoryId }, { onSuccess: handleSuccess })
      }
      title={`Delete Layer`}
      description={`This will delete an existing layer, you can't revert this action.`}
      isLoading={isLoading}
      data={[{ label: 'Name', value: layerElement.name }]}
    />
  )
}

export default LayerElementDeleteModal
