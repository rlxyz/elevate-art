import { Popover } from '@headlessui/react'
import { DotsHorizontalIcon, PlusIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
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
        <div className='py-2 flex space-x-2 justify-end items-center h-full w-full px-2'>
          <Popover className='flex space-x-1' {...props}>
            <Popover.Button className='group inline-flex items-center text-xs'>
              <DotsHorizontalIcon className='text-darkGrey w-3 h-3' />
            </Popover.Button>
            <Popover.Panel className='absolute z-10 w-56 mt-2 bg-white rounded-md shadow-lg'>
              <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                <div className='bg-lightGray space-y-2 divide-y divide-mediumGrey'>
                  <div className='p-2 flex flex-col items-start space-y-3'>
                    <div className='w-full space-y-2'>
                      <button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className='text-black items-center flex space-x-2 w-full'
                      >
                        <PlusIcon className='w-4 h-4' />
                        <span className='text-xs'>New</span>
                      </button>
                      <button
                        className='text-black items-center flex space-x-2 w-full'
                        onClick={(e) => {
                          e.preventDefault()
                          onReorderButtonClicked()
                        }}
                      >
                        <SwitchVerticalIcon className='w-4 h-4' />
                        <span className='text-xs'>Reorder Items</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Popover>

          <button onClick={() => setIsCreateDialogOpen(true)} className='text-darkGrey items-center flex space-x-2'>
            <PlusIcon className='w-3 h-3' />
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
