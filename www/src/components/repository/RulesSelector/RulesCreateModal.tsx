import ModalComponent from '@components/layout/modal/Modal'
import { useMutateRepositoryCreateRule } from '@hooks/mutations/useMutateRepositoryCreateRule'
import { TraitElement } from '@prisma/client'
import { RulesType } from '@utils/compiler'
import { FC } from 'react'

export interface FormModalProps {
  onSuccess?: () => void
  onError?: () => void
  onClose: () => void
  visible: boolean
}

interface TraitElementCreateRuleProps extends FormModalProps {
  traitElements: [TraitElement, TraitElement]
  condition: RulesType
}

export const RulesCreateModal: FC<TraitElementCreateRuleProps> = ({ visible, onClose, condition, onSuccess, traitElements }) => {
  const { mutate, isLoading } = useMutateRepositoryCreateRule()

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
      onClick={() => {
        mutate(
          {
            condition,
            primaryTraitElementId: traitElements[0].id,
            primaryLayerElementId: traitElements[0].layerElementId,
            secondaryTraitElementId: traitElements[1].id,
            secondaryLayerElementId: traitElements[1].layerElementId,
          },
          { onSuccess: handleSuccess, onError: handleClose }
        )
      }}
      data={[
        { label: 'Trait', value: traitElements[0].name },
        { label: 'Condition', value: condition },
        { label: 'With', value: traitElements[1].name },
      ]}
      title='Create Rule'
      description={`Add a new rule to the repository. This rule will be applied to all collections in the repository.`}
      isLoading={isLoading}
    />
  )
}
