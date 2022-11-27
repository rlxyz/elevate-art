import { SelectorIcon } from '@heroicons/react/outline'
import { LayerElement, Repository } from '@prisma/client'
import clsx from 'clsx'
import { AnimatePresence, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import { PreviewImageCardStandalone } from 'src/client/components/collection/CollectionPreviewImage'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import { LayerElementWithRules } from 'src/client/hooks/query/useQueryRepositoryLayer'
import { useMutateLayerElementUpdateOrder } from '../../../hooks/router/layerElement/useMutateLayerElementUpdateOrder'
import { useRaisedShadow } from '../../../hooks/utils/useRaisedShadow'
import { FormModalProps } from './LayerElementDeleteModal'

interface LayerElementRenameProps extends FormModalProps {
  layerElements: LayerElementWithRules[]
  repository: Repository
}

interface Props {
  repositoryId: string
  item: LayerElement
}

export type ReorderItemProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const LayerElementReorderItem: FC<ReorderItemProps> = ({ repositoryId, item, className, ...props }) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className={clsx(className, 'bg-lightGray relative flex w-full items-center border border-mediumGrey rounded-[5px] px-4 py-2')}
    >
      <SelectorIcon
        className='absolute w-3 h-3'
        onPointerDown={(e) => {
          e.preventDefault()
          dragControls.start(e)
        }}
      />
      <span className='mx-7 w-full flex items-center text-xs whitespace-nowrap overflow-hidden' {...props}>
        {item.name}
      </span>
    </Reorder.Item>
  )
}

const LayerElementReorderModal: FC<LayerElementRenameProps> = ({ repository, layerElements, visible, onClose }) => {
  const [items, setItems] = useState<LayerElementWithRules[]>(layerElements)
  const { mutate, isLoading } = useMutateLayerElementUpdateOrder()

  useEffect(() => {
    setItems(layerElements)
  }, [layerElements.length])

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
      <div className='grid grid-cols-10 gap-x-6'>
        <div className='col-span-5'>
          <AnimatePresence>
            <Reorder.Group
              axis='y'
              layoutScroll
              values={items}
              className='flex flex-col space-y-2 max-h-[calc(100vh-17.5rem)] no-scrollbar overflow-y-scroll border border-mediumGrey rounded-[5px] p-2 overflow-hidden'
              onReorder={setItems}
            >
              {items.map((x) => (
                <LayerElementReorderItem key={x.id} item={x} repositoryId={repository.id} />
              ))}
            </Reorder.Group>
          </AnimatePresence>
        </div>
        <div className='col-span-5'>
          <div className='relative h-full w-full'>
            <PreviewImageCardStandalone
              id={0}
              collection={{
                id: '',
                name: 'reorder',
                type: '',
                totalSupply: 1,
                generations: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                repositoryId: repository.id,
              }}
              layers={items}
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  )
}

export default LayerElementReorderModal
