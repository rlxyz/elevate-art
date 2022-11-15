import Menu from '@components/Layout/menu'
import { PlusIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
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
  }, [currentLayerId, layers.length])

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
      <div className={'border border-mediumGrey rounded-[5px]'}>
        <div className='relative py-4 flex space-x-2 justify-end items-center h-full w-full px-2'>
          <Menu>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon className='w-3 h-3' />
                <span className='text-xs'>New</span>
              </Menu.Item>
              <Menu.Item as='button' type='button' onClick={() => onReorderButtonClicked()}>
                <SwitchVerticalIcon className='w-3 h-3' />
                <span className='text-xs'>Reorder Items</span>
              </Menu.Item>
            </Menu.Items>
          </Menu>
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
