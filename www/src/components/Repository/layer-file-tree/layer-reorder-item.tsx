import NextLinkComponent from '@components/Layout/link/NextLink'
import Menu from '@components/Layout/menu'
import { ArrowSmUpIcon, LinkIcon, PencilIcon, SelectorIcon, TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/utils/useNotification'
import { LayerElement } from '@prisma/client'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import router from 'next/router'
import { FC, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import LayerElementDeleteModal from './layer-delete-modal'
import LayerElementRenameModal from './layer-rename-modal'
import { useRaisedShadow } from './layer-reorder-item-shadow'

interface Props {
  item: LayerElement
  enabled: boolean
  isReorderable: boolean
}

export type ModalProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This component allows the end user to reorder items by dragging the ReorderItem up/down to it's desired location
 *
 * @todo rework the Link component being used here
 */
export const ReorderItem: FC<ModalProps> = ({ item, enabled, isReorderable, className, ...props }) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { notifyInfo } = useNotification()
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)

  const onClipboardCopy = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    navigator.clipboard.writeText(
      `${origin}/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`
    )
    notifyInfo('Copied to clipboard')
  }

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={clsx(className, 'relative', enabled && 'font-bold bg-lightGray')}
    >
      <NextLinkComponent
        href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
        className='py-2'
      >
        <div className='relative flex w-full items-center'>
          {isReorderable && (
            <SelectorIcon
              className='ml-2 absolute w-3 h-3'
              onPointerDown={(e) => {
                e.preventDefault()
                dragControls.start(e)
              }}
            />
          )}
          <span className='mx-7 w-full flex items-center text-xs whitespace-nowrap overflow-hidden' {...props}>
            {item.name}
          </span>
        </div>
      </NextLinkComponent>
      {isHovered && !isReorderable && (
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
              href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ArrowSmUpIcon className='w-3 h-3' />
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
          // @todo fix this, should end up at first element
          router.push(`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}`)
        }}
      />
      <LayerElementRenameModal onClose={() => setIsRenameDialogOpen(false)} visible={isRenameDialogOpen} layerElement={item} />
    </Reorder.Item>
  )
}
