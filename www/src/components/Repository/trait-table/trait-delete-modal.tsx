import ModalComponent from '@components/Layout/Modal'
import { useMutateDeleteTrait } from '@hooks/mutations/useMutateDeleteTrait'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'

interface Props {
  onClose?: () => void
  visible?: boolean
  traitElements: TraitElement[]
}

const TraitElementDeleteModal = ({ visible, onClose, traitElements }: Props) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateDeleteTrait()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Delete Trait'
      description={`You are deleting ${traitElements.length} traits. This will be applied to all collections in the project`}
      data={[]}
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
