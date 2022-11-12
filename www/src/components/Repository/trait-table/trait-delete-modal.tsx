import ModalComponent from '@components/Layout/Modal'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import Big from 'big.js'
import { FC } from 'react'
import { useMutateDeleteTraitElement } from './trait-delete-mutate-hook'

interface Props {
  onClose: () => void
  visible: boolean
  traitElements: {
    checked: boolean
    locked: boolean
    weight: Big
    id: string
    name: string
    layerElementId: string
    updatedAt: Date
    createdAt: Date
  }[]
}

const TraitElementDeleteModal: FC<Props> = ({ visible, onClose, traitElements }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateDeleteTraitElement()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Delete Trait'
      description={`You are deleting ${traitElements.length} traits. This will be applied to all collections in the project`}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
        mutate(
          {
            traitElements: traitElements.map(({ id, layerElementId }) => ({
              id,
              layerElementId,
              repositoryId,
            })),
          },
          { onSettled: onClose }
        )
      }}
    />
  )
}

export default TraitElementDeleteModal
