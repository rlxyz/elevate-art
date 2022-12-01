import { LayerElement } from "@elevateart/db";
import { FC } from "react";
import ModalComponent from "src/components/layout/modal/Modal";
import { useMutateLayerElementDelete } from "src/hooks/trpc/layerElement/useMutateLayerElementDelete";

export interface FormModalProps {
  onSuccess?: () => void;
  onError?: () => void;
  onClose: () => void;
  visible: boolean;
}

export interface LayerElementDeleteProps extends FormModalProps {
  layerElement: LayerElement;
}

const LayerElementDeleteModal: FC<LayerElementDeleteProps> = ({ layerElement, visible, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateLayerElementDelete();

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess && onSuccess();
    handleClose();
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      onClick={(e) => {
        e.preventDefault();
        mutate(
          {
            layerElementId: layerElement.id,
            repositoryId: layerElement.repositoryId,
          },
          { onSuccess: handleSuccess },
        );
      }}
      title={`Delete Layer`}
      description={`This will delete an existing layer, you can't revert this action.`}
      isLoading={isLoading}
      data={[{ label: "Name", value: layerElement.name }]}
    />
  );
};

export default LayerElementDeleteModal;
