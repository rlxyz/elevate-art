import { SwitchVerticalIcon } from '@heroicons/react/solid'
import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import { FC, useState } from 'react'
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
  const [items, setItems] = useState<string[]>(layers.map((x) => x.id))
  const [openReordering, setOpenReordering] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  return (
    <div {...props} className={clsx(className, 'space-y-4')}>
      <div className='flex flex-row justify-between items-end'>
        <h3 className='text-md font-semibold'>Your Layers</h3>
        <div className='flex space-x-1 w-[15%]'>
          <button
            className={clsx(
              'flex w-full items-center justify-center space-x-2 p-2 text-xs border border-mediumGrey bg-white rounded-[5px] text-darkGrey'
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
        </div>
      </div>

      <LayerElementFileSelector
        items={items}
        isReorderable={openReordering}
        onReorder={setItems}
        layers={layers}
        itemEnabledIndex={items.findIndex((x) => x === currentLayerId)}
      />
      <LayerElementReorderConfirmModal
        layerElements={layers}
        onClose={() => setIsConfirmDialogOpen(false)}
        visible={isConfirmDialogOpen}
      />
    </div>
  )
}

export default LayerElementFileTree
