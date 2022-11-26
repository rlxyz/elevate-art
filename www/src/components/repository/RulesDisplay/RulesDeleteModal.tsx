import ModalComponent from '@components/layout/modal/Modal'
import { useMutateDeleteRule } from '@hooks/mutations/useMutateDeleteRule'
import { TraitElementRule } from '@hooks/query/useQueryRepositoryLayer'
import { FC } from 'react'

export interface FormModalProps {
  onSuccess?: () => void
  onError?: () => void
  onClose: () => void
  visible: boolean
}

interface TraitElementDeleteRuleProps extends FormModalProps {
  rule: TraitElementRule
}

export const RulesDeleteModal: FC<TraitElementDeleteRuleProps> = ({ visible, rule, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateDeleteRule()

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
        mutate({ id: rule.id }, { onSuccess: handleSuccess, onError: handleClose })
      }}
      title='Delete Rule'
      description={`Delete an existing rule from the repository. This rule will be applied to all collections in the repository.`}
      isLoading={isLoading}
    />
  )
}
