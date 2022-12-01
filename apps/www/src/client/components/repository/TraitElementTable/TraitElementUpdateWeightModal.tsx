import Big from "big.js";
import { FC } from "react";
import ModalComponent from "src/client/components/layout/modal/Modal";
import { useMutateTraitElementUpdateWeight } from "../../../hooks/trpc/traitElement/useMutateTraitElementUpdateWeight";

interface Props {
  onClose: () => void;
  visible: boolean;
  traitElements: {
    checked: boolean;
    locked: boolean;
    weight: Big;
    id: string;
    name: string;
    layerElementId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  onSuccess: () => void;
}

const TraitElementUpdateWeightModal: FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  traitElements,
}) => {
  /** Update weight mutation */
  const { mutate, isLoading } = useMutateTraitElementUpdateWeight();

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title="Update Rarity"
      description={`You are updating the rarity of the selected traits. This action cannot be undone.`}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault();
        mutate(
          {
            traitElements: traitElements
              .slice(1)
              .map(({ id, weight, layerElementId }) => ({
                layerElementId,
                traitElementId: id,
                weight: weight.toNumber(),
              })),
          },
          {
            onSuccess: () => {
              onSuccess();
            },
            onSettled: () => {
              onClose();
            },
          },
        );
      }}
    />
  );
};

export default TraitElementUpdateWeightModal;
