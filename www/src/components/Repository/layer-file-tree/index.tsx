import Menu from '@components/Layout/menu'
import { PlusIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
import { LayerElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import { Repository } from '@prisma/client'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import LayerElementCreateModal from './layer-create-modal'
import LayerElementFileSelector from './layer-reorder'
import LayerElementReorderModal from './layer-reorder-modal'

interface Props {
  repository: Repository | undefined
  layerElements: LayerElementWithRules[] | undefined
  currentLayerId: string // current layer id
}

export type LayerElementFileTreeProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * The core LayerElement File Tree. It handles selection of the current layer route & reordering of layers.
 */
const LayerElementFileTree: FC<LayerElementFileTreeProps> = ({
  repository,
  layerElements = [],
  currentLayerId,
  className,
  ...props
}) => {
  const [items, setItems] = useState<LayerElementWithRules[]>(layerElements)
  const [openReordering, setOpenReordering] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    setItems(layerElements)
  }, [currentLayerId, layerElements.length])

  /** Handles the last updated LayerElement */
  const layerElementLastEdited = () => {
    return layerElements.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())[0]?.updatedAt || new Date()
  }

  /** Handles the first LayerElement that was created. Basically, the inception of the repository. */
  const layerElementCreatedAt = () => {
    return repository?.createdAt || new Date()
  }

  return (
    <div {...props} className={clsx(className)}>
      <div className={'border border-mediumGrey rounded-[5px]'}>
        <div className='relative py-4 flex justify-end items-center px-2'>
          <Menu>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon className='w-3 h-3' />
                <span className='text-xs'>New</span>
              </Menu.Item>
              <Menu.Item as='button' type='button' onClick={() => setOpenReordering(true)}>
                <SwitchVerticalIcon className='w-3 h-3' />
                <span className='text-xs'>Reorder Items</span>
              </Menu.Item>
            </Menu.Items>

            <Menu.Items>
              <div className='text-darkGrey text-[0.6rem] space-x-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                <span>Last Edited</span>
                <span>{timeAgo(layerElementLastEdited())}</span>
              </div>
              <div className='text-darkGrey text-[0.6rem] space-x-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                <span>Created</span>
                <span>{timeAgo(layerElementCreatedAt())}</span>
              </div>
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
      {/** @todo Fix this */}
      {repository && (
        <LayerElementReorderModal
          onReorder={setItems}
          layerElements={items}
          repository={repository}
          onClose={() => setOpenReordering(false)}
          visible={openReordering}
        />
      )}

      <LayerElementCreateModal onClose={() => setIsCreateDialogOpen(false)} visible={isCreateDialogOpen} />
    </div>
  )
}

export default LayerElementFileTree
