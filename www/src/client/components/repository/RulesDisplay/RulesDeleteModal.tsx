import { Rules } from '@hooks/router/layerElement/useQueryLayerElementFindAll'
import { useMutateRuleDelete } from '@hooks/router/rule/useMutateRuleDelete'
import { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface FormModalProps {
  onSuccess?: () => void
  onError?: () => void
  onClose: () => void
  visible: boolean
}

interface TraitElementDeleteRuleProps extends FormModalProps {
  rule: Rules
}

export const RulesDeleteModal: FC<TraitElementDeleteRuleProps> = ({ visible, rule, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateRuleDelete()

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
        mutate({ ruleId: rule.id }, { onSuccess: handleSuccess, onError: handleClose })
      }}
      title='Delete Rule'
      description={`Delete an existing rule from the repository. This rule will be applied to all collections in the repository.`}
      isLoading={isLoading}
    />
  )
}
