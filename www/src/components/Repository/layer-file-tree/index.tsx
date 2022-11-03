import { PlusIcon } from '@heroicons/react/outline'
import { SwitchVerticalIcon } from '@heroicons/react/solid'
import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import { FC, useState } from 'react'
import LayerElementCreateModal from './layer-create-modal'
import LayerElementFileSelector from './layer-reorder'
import LayerElementReorderConfirmModal from './layer-reorder-confirm-modal'

interface Props {
  layers: LayerElement[]
  currentLayerId: string
}

export type LayerElementFileTreeProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * The core LayerElement File Tree. It handles selection of the current layer route & reordering of layers.
 */
const LayerElementFileTree: FC<LayerElementFileTreeProps> = ({ layers, currentLayerId, className, ...props }) => {
  const [items, setItems] = useState<LayerElement[]>(layers)
  const [openReordering, setOpenReordering] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div {...props} className={clsx(className, 'space-y-4')}>
      <div className='flex flex-row justify-between items-end'>
        <button
          className={clsx(
            openReordering && 'border-blueHighlight text-blueHighlight',
            'flex items-center justify-center space-x-2 p-2 text-xs border border-mediumGrey bg-white rounded-[5px] text-darkGrey'
          )}
          onClick={() => {
            if (!openReordering) {
              setOpenReordering(true)
            } else {
              setIsConfirmDialogOpen(true)
              setOpenReordering(false)
            }
          }}
        >
          <SwitchVerticalIcon className='w-3 h-3' />
        </button>
        <button
          className={clsx(
            'flex items-center justify-center space-x-2 p-2 text-xs border border-mediumGrey bg-white rounded-[5px] text-darkGrey'
          )}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusIcon className='w-3 h-3' />
        </button>
      </div>

      <LayerElementFileSelector
        items={items}
        isReorderable={openReordering}
        onReorder={setItems}
        itemEnabledIndex={items.findIndex((x) => x.id === currentLayerId)}
      />
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
