import { PlusIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
import { LayerElement } from '@hooks/router/layerElement/useQueryLayerElementFindAll'
import { Repository } from '@prisma/client'
import clsx from 'clsx'
import router from 'next/router'
import { FC, useState } from 'react'
import Menu from 'src/client/components/layout/menu'
import { timeAgo } from 'src/client/utils/time'
import LayerElementCreateModal from './LayerElementCreateModal'
import LayerElementFileSelector from './LayerElementFileSelector'
import LayerElementReorderModal from './LayerElementReorderItem'

interface Props {
  repository: Repository | undefined
  layerElements: LayerElement[]
}

export type LayerElementFileTreeProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * The core LayerElement File Tree. It handles selection of the current layer route & reordering of layers.
 */
const LayerElementFileTree: FC<LayerElementFileTreeProps> = ({ repository, layerElements, className, ...props }) => {
  const [openReordering, setOpenReordering] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const layerName: string = router.query.layer as string

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
      <div className={'border border-mediumGrey rounded-[5px] divide-y divide-mediumGrey'}>
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

        <LayerElementFileSelector items={layerElements} itemEnabledIndex={layerElements.findIndex((x) => x.name === layerName)} />
      </div>

      {/** Handles all Repository related mutations */}
      {repository && (
        <>
          <LayerElementReorderModal
            onClose={() => setOpenReordering(false)}
            visible={openReordering}
            repository={repository}
            layerElements={layerElements}
          />
          <LayerElementCreateModal onClose={() => setIsCreateDialogOpen(false)} visible={isCreateDialogOpen} repository={repository} />
        </>
      )}
    </div>
  )
}

export default LayerElementFileTree
