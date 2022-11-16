import { PreviewImageCardStandalone } from '@components/Collection/CollectionPreviewImage'
import ModalComponent from '@components/Layout/modal/Modal'
import { SelectorIcon } from '@heroicons/react/outline'
import { LayerElementWithRules, useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import { LayerElement, Repository } from '@prisma/client'
import clsx from 'clsx'
import { AnimatePresence, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { FC } from 'react'
import { FormModalProps } from './layer-delete-modal'
import { useMutateRenameLayerElement } from './layer-rename-modal-hook'
import { useRaisedShadow } from './layer-reorder-item-shadow'

interface LayerElementRenameProps extends FormModalProps {
  layerElements: LayerElementWithRules[]
  onReorder: (newOrder: any[]) => void
  repository: Repository
}

interface Props {
  repositoryId: string
  item: LayerElement
}

export type ReorderItemProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const ReorderItem: FC<ReorderItemProps> = ({ repositoryId, item, className, ...props }) => {
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
      className={clsx(
        className,
        'bg-lightGray relative flex w-full items-center border border-mediumGrey rounded-[5px] px-4 py-2'
      )}
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

const LayerElementReorderModal: FC<LayerElementRenameProps> = ({ repository, layerElements, visible, onClose, onReorder }) => {
  const { mutate, isLoading } = useMutateRenameLayerElement()
  const { all: layers } = useQueryRepositoryLayer()
  return (
    <ModalComponent
      visible={visible}
      onClose={() => onClose()}
      title={`Reorder Layers`}
      description={`This action will be applied to all collections automatically.`}
      isLoading={isLoading}
      className='w-[600px]'
    >
      <div className='grid grid-cols-10 gap-x-6'>
        <div className='col-span-5'>
          <AnimatePresence>
            <Reorder.Group
              axis='y'
              layoutScroll
              values={layerElements}
              className='flex flex-col space-y-2 max-h-[calc(100vh-17.5rem)] no-scrollbar border border-mediumGrey rounded-[5px] p-2 overflow-hidden'
              onReorder={onReorder}
            >
              {layerElements.map((x) => (
                <ReorderItem key={x.id} item={x} repositoryId={repository.id} />
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
              layers={layerElements}
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  )
}

export default LayerElementReorderModal
