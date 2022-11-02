import ModalComponent from '@components/Layout/Modal'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { FC } from 'react'
import { useMutateRenameTraitElement } from './trait-rename-mutate-hook'

interface Props {
  onClose: () => void
  visible: boolean
  traitElements: TraitElement[]
}

const TraitElementRenameModal: FC<Props> = ({ visible, onClose, traitElements }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateRenameTraitElement()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Rename Trait'
      description={`You are renaming `}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
        mutate(
          { traitElements: traitElements.map(({ id, name }) => ({ repositoryId, traitElementId: id, name })) },
          { onSettled: onClose }
        )
      }}
    />
  )
}

export default TraitElementRenameModal
