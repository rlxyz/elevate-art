import { useMutateLayerElementUpdateOrder } from '@hooks/trpc/layerElement/useMutateLayerElementUpdateOrder'
import type { LayerElement } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import type { Repository } from '@prisma/client'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import type { FormModalProps } from './LayerElementDeleteModal'
import { LayerElementReorder } from './LayerElementReorder'

export interface LayerElementReorderProps extends FormModalProps {
  layerElements: LayerElement[]
  repository: Repository
}

const LayerElementReorderModal: FC<LayerElementReorderProps> = ({ repository, layerElements, visible, onClose }) => {
  const { mutate, isLoading } = useMutateLayerElementUpdateOrder()
  const sorted = layerElements.sort((a, b) => a.priority - b.priority)
  const [items, setItems] = useState<LayerElement[]>(sorted)

  useEffect(() => {
    setItems(layerElements)
  }, [sorted.length])

  if (!repository) return null

  return (
    <ModalComponent
      visible={visible}
      onClose={() => onClose()}
      title={`Reorder Layers`}
      description={`This action will be applied to all collections automatically.`}
      isLoading={isLoading}
      className='w-[600px]'
      onClick={(e) => {
        e.preventDefault()
        mutate(
          {
            layerElements: items.map(({ id }, index) => ({
              layerElementId: id,
              priority: index,
            })),
          },
          { onSettled: onClose }
        )
      }}
    >
      <LayerElementReorder repository={repository} layerElements={layerElements} items={items} setItems={setItems} />
    </ModalComponent>
  )
}

export default LayerElementReorderModal
