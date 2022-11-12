import ModalComponent from '@components/Layout/Modal'
import { useMutateRepositoryLayersWeight } from '@hooks/mutations/useMutateRepositoryLayersWeight'
import Big from 'big.js'
import { FC } from 'react'

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
    createdAt: Date
    updatedAt: Date
  }[]
  onSuccess: () => void
}

const TraitElementUpdateWeightModal: FC<Props> = ({ visible, onClose, onSuccess, traitElements }) => {
  /** Update weight mutation */
  const { mutate, isLoading } = useMutateRepositoryLayersWeight()

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Update Rarity'
      description={`You are updating the rarity of the selected traits. This action cannot be undone.`}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
        mutate(
          {
            traitElements: traitElements.slice(1).map(({ id, weight, layerElementId }) => ({
              layerElementId,
              traitElementId: id,
              weight: weight.toNumber(),
            })),
          },
          {
            onSuccess: () => {
              onSuccess()
            },
            onSettled: () => {
              onClose()
            },
          }
        )
      }}
    />
  )
}

export default TraitElementUpdateWeightModal
