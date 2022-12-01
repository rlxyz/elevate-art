import { RulesType } from "@elevateart/compiler";
import { FC } from "react";
import ModalComponent from "src/components/layout/modal/Modal";
import { TraitElement } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { useMutateRuleCreate } from "src/hooks/trpc/rule/useMutateRuleCreate";

export interface FormModalProps {
  onSuccess?: () => void;
  onError?: () => void;
  onClose: () => void;
  visible: boolean;
}

interface TraitElementCreateRuleProps extends FormModalProps {
  traitElements: [TraitElement, TraitElement];
  condition: RulesType;
}

export const RulesCreateModal: FC<TraitElementCreateRuleProps> = ({ visible, onClose, condition, onSuccess, traitElements }) => {
  const { mutate, isLoading } = useMutateRuleCreate();

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
      onClick={() => {
        mutate(
          {
            condition,
            traitElements: [traitElements[0].id, traitElements[1].id],
          },
          { onSuccess: handleSuccess, onError: handleClose },
        );
      }}
      data={[
        { label: "Trait", value: traitElements[0].name },
        { label: "Condition", value: condition },
        { label: "With", value: traitElements[1].name },
      ]}
      title="Create Rule"
      description={`Add a new rule to the repository. This rule will be applied to all collections in the repository.`}
      isLoading={isLoading}
    />
  );
};
