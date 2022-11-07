import { PlusIcon } from '@heroicons/react/outline'
import { SwitchVerticalIcon } from '@heroicons/react/solid'
import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import LayerElementCreateModal from './layer-create-modal'
import LayerElementFileSelector from './layer-reorder'
import LayerElementReorderConfirmModal from './layer-reorder-confirm-modal'

interface Props {
  layers: LayerElement[] | undefined
  currentLayerId: string // current layer id
}

export type LayerElementFileTreeProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * The core LayerElement File Tree. It handles selection of the current layer route & reordering of layers.
 */
const LayerElementFileTree: FC<LayerElementFileTreeProps> = ({ layers = [], currentLayerId, className, ...props }) => {
  const [items, setItems] = useState<LayerElement[]>(layers)
  const [openReordering, setOpenReordering] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    setItems(layers)
  }, [currentLayerId])

  const onReorderButtonClicked = () => {
    if (!openReordering) {
      setOpenReordering(true)
    } else {
      setIsConfirmDialogOpen(true)
      setOpenReordering(false)
    }
  }

  return (
    <div {...props} className={clsx(className)}>
      <div className={'border border-mediumGrey rounded-[5px] max-h-[calc(100vh-17.5rem)]'}>
        <div className='flex space-x-2 justify-between'>
          <button
            className='hover:bg-lightGray p-2'
            onClick={(e) => {
              e.preventDefault()
              onReorderButtonClicked()
            }}
          >
            <SwitchVerticalIcon className='w-3 h-3 text-darkGrey' />
          </button>
          <button
            className='hover:bg-lightGray p-2'
            onClick={(e) => {
              e.preventDefault()
              setIsCreateDialogOpen(true)
            }}
          >
            <PlusIcon className='w-3 h-3 text-darkGrey' />
          </button>
        </div>
        <LayerElementFileSelector
          className='border-t border-mediumGrey'
          items={items}
          isReorderable={openReordering}
          onReorder={setItems}
          itemEnabledIndex={items.findIndex((x) => x.id === currentLayerId)}
        />
      </div>

      <LayerElementReorderConfirmModal
        layerElements={items}
        onClose={() => setIsConfirmDialogOpen(false)}
        visible={isConfirmDialogOpen}
      />
      <LayerElementCreateModal onClose={() => setIsCreateDialogOpen(false)} visible={isCreateDialogOpen} />
    </div>
  )
}

export default LayerElementFileTree
