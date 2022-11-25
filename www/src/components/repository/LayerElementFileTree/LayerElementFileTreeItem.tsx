import { ArrowTopRightIcon } from '@components/layout/icons/ArrowTopRightIcon'
import NextLinkComponent from '@components/layout/link/NextLink'
import Menu from '@components/layout/menu'
import { LinkIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/utils/useNotification'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { LayerElement } from '@prisma/client'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import router from 'next/router'
import { FC, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import LayerElementDeleteModal from './LayerElementDeleteModal'
import LayerElementRenameModal from './LayerElementRenameModal'

interface Props {
  item: LayerElement
  enabled: boolean
}

export type ModalProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This component allows the end user to reorder items by dragging the ReorderItem up/down to it's desired location
 *
 * @todo rework the Link component being used here
 */
export const LayerElementFileTreeItem: FC<ModalProps> = ({ item, enabled, className, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { notifyInfo } = useNotification()
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const { mainRepositoryHref } = useRepositoryRoute()

  const onClipboardCopy = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    navigator.clipboard.writeText(`${origin}/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`)
    notifyInfo('Copied to clipboard')
  }

  return (
    <div
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={clsx(className, 'relative hover:font-semibold', enabled && 'font-semibold bg-lightGray')}
    >
      <NextLinkComponent href={`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`} className='py-2'>
        <div className='relative flex w-full items-center'>
          <span className='mx-7 w-full flex items-center text-xs whitespace-nowrap overflow-hidden' {...props}>
            {item.name}
          </span>
        </div>
      </NextLinkComponent>
      {isHovered && (
        <Menu>
          <Menu.Items>
            <Menu.Item
              as='button'
              type='button'
              onClick={() => {
                setIsDeleteDialogOpen(true)
              }}
            >
              <TrashIcon className='w-3 h-3' />
              <span>Delete</span>
            </Menu.Item>

            <Menu.Item as='button' type='button' onClick={onClipboardCopy}>
              <LinkIcon className='w-3 h-3' />
              <span>Copy Link</span>
            </Menu.Item>

            <Menu.Item
              as={NextLinkComponent}
              href={`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ArrowTopRightIcon className='w-3 h-3' />
              <span>Open in new window</span>
            </Menu.Item>

            <Menu.Item as='button' onClick={() => setIsRenameDialogOpen(true)}>
              <PencilIcon className='w-3 h-3' />
              <span>Rename</span>
            </Menu.Item>
          </Menu.Items>

          <Menu.Items>
            <div className='text-darkGrey text-[0.6rem] space-x-1 overflow-hidden text-ellipsis whitespace-nowrap'>
              <span>Last Edited</span>
              <span>{timeAgo(item.updatedAt)}</span>
            </div>
            <div className='text-darkGrey text-[0.6rem] space-x-1 overflow-hidden text-ellipsis whitespace-nowrap'>
              <span>Created</span>
              <span>{timeAgo(item.createdAt)}</span>
            </div>
          </Menu.Items>
        </Menu>
      )}
      <LayerElementDeleteModal
        onClose={() => setIsDeleteDialogOpen(false)}
        visible={isDeleteDialogOpen}
        layerElement={item}
        onSuccess={() => {
          if (!enabled) return
          router.push(`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}`)
        }}
      />
      <LayerElementRenameModal onClose={() => setIsRenameDialogOpen(false)} visible={isRenameDialogOpen} layerElement={item} />
    </div>
  )
}
