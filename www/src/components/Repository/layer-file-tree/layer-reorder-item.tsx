import NextLinkComponent from '@components/Layout/link/NextLink'
import SearchComponent from '@components/Layout/SearchInput'
import { Menu, Transition } from '@headlessui/react'
import { ArrowSmUpIcon, LinkIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { useNotification } from '@hooks/utils/useNotification'
import { LayerElement } from '@prisma/client'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import router from 'next/router'
import { FC, Fragment, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import LayerElementDeleteModal from './layer-delete-modal'
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
      className={clsx(className, 'relative', 'hover:bg-lightGray', enabled ? 'font-bold' : 'hover:font-semibold')}
    >
      <NextLinkComponent
        href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
        className='py-2'
      >
        <div className='relative flex w-full items-center'>
          {isReorderable && (
            <DotsHorizontalIcon
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
      {isHovered && (
        <Menu as='div' className='absolute right-0 mr-2 top-1/2 -translate-y-1/2 flex items-center'>
          <Menu.Button className='p-0.5 inline-flex hover:border hover:border-mediumGrey hover:bg-mediumGrey rounded-[5px] text-darkGrey'>
            <DotsHorizontalIcon
              className='w-3 h-3'
              onPointerDown={(e) => {
                e.preventDefault()
                dragControls.start(e)
              }}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='font-normal absolute overflow-visible z-5 w-56 mt-2 bg-white rounded-md shadow-lg'>
              <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                <div className='bg-lightGray divide-y divide-mediumGrey'>
                  <div className='p-2 flex flex-col items-start space-y-2'>
                    <SearchComponent />
                    <div className='w-full'>
                      <Menu.Item
                        as='button'
                        type='button'
                        className='flex items-center w-full py-1.5 px-1 space-x-2 text-xs rounded-[3px] hover:bg-mediumGrey'
                        onClick={() => {
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <TrashIcon className='w-3 h-3' />
                        <span>Delete</span>
                      </Menu.Item>

                      <Menu.Item
                        as='button'
                        type='button'
                        className='flex items-center w-full py-1.5 px-1 space-x-2 text-xs rounded-[3px] hover:bg-mediumGrey'
                        onClick={onClipboardCopy}
                      >
                        <LinkIcon className='w-3 h-3' />
                        <span>Copy Link</span>
                      </Menu.Item>

                      <Menu.Item
                        as={NextLinkComponent}
                        href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${item.name}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center w-full py-1.5 px-1 space-x-2 text-xs rounded-[3px] hover:bg-mediumGrey'
                      >
                        <ArrowSmUpIcon className='w-3 h-3' />
                        <span>Open in new window</span>
                      </Menu.Item>

                      <Menu.Item
                        as='button'
                        className='flex items-center w-full py-1.5 px-1 space-x-2 text-xs rounded-[3px] hover:bg-mediumGrey'
                      >
                        <PencilIcon className='w-3 h-3' />
                        <span>Rename</span>
                      </Menu.Item>
                    </div>
                  </div>
                  <div className='p-2 flex flex-col items-start space-y-2 cursor-default'>
                    <div className='text-darkGrey text-[0.6rem] space-x-1'>
                      <span>Last Edited</span>
                      <span>{timeAgo(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      <LayerElementDeleteModal
        onClose={() => setIsDeleteDialogOpen(false)}
        visible={isDeleteDialogOpen}
        layerElement={item}
        onSuccess={() => router.push(`/${organisationName}/${repositoryName}`)}
      />
    </Reorder.Item>
  )
}
