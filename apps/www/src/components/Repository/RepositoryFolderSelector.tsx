import { Link } from '@components/Layout/Link'
import { DotsHorizontalIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
import { useMutateReorderLayers } from '@hooks/mutations/useMutateReorderLayers'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { truncate } from '@utils/format'
import clsx from 'clsx'
import { animate, AnimatePresence, MotionValue, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    value.onChange((latest) => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])

  return boxShadow
}

export const ReorderItem = ({
  item,
  name,
  enabled,
  canReorder,
  rounded,
}: {
  rounded: boolean
  item: string
  name: string
  enabled: boolean
  canReorder: boolean
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  return (
    <Reorder.Item value={item} id={item.toString()} style={{ boxShadow, y }} dragListener={false} dragControls={dragControls}>
      <Link
        href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${name}`}
        enabled={enabled}
        disabled={canReorder}
        hover
        rounded={rounded}
      >
        <div className={clsx('text-black', 'flex justify-between w-full')}>
          <div className='px-5 flex flex-row items-center justify-between text-xs w-full'>
            <span>{name}</span>
          </div>
          {canReorder && (
            <DotsHorizontalIcon
              className='mr-2 w-4 h-4'
              onPointerDown={(e) => {
                e.preventDefault()
                dragControls.start(e)
              }}
            />
          )}
        </div>
      </Link>
    </Reorder.Item>
  )
}

const LayerFolderSelector = () => {
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [items, setItems] = useState<string[]>()
  const [openReordering, setOpenReordering] = useState(false)
  const { mutate: reorderLayer } = useMutateReorderLayers()
  useEffect(() => {
    if (!layers) return
    setItems(layers.map((x) => x.id))
  }, [layers?.length])
  if (!layers || !items) return null

  return (
    <>
      <div className='flex flex-row justify-between items-end'>
        <h3 className='text-md font-semibold'>Your Layers</h3>
        <div className='flex space-x-1 w-[15%]'>
          {/* <button
            className={clsx(
              'flex w-full items-center justify-center space-x-2 p-2 text-xs border border-border bg-white text-darkGrey rounded-[5px]'
            )}
          >
            <PlusIcon className='w-3 h-3 text-darkGrey' />
          </button> */}
          <button
            className={clsx(
              openReordering ? 'text-blueHighlight border-blueHighlight' : ' text-darkGrey',
              'flex w-full items-center justify-center space-x-2 p-2 text-xs border border-border bg-white rounded-[5px]'
            )}
            onClick={() => {
              if (!openReordering) {
                setOpenReordering(true)
              } else {
                reorderLayer({ layerIdsInOrder: items })
                setOpenReordering(false)
              }
            }}
          >
            <SwitchVerticalIcon className='w-3 h-3' />
          </button>
        </div>
      </div>
      <aside className='space-y-1'>
        <div className='border border-border rounded-[5px] max-h-[calc(100vh-17.5rem)]'>
          <AnimatePresence>
            <Reorder.Group axis='y' layoutScroll style={{ overflowY: 'scroll' }} onReorder={setItems} values={items}>
              {items.map((item, index) => {
                return (
                  <ReorderItem
                    rounded={index === 0 || index === items.length - 1 ? true : false}
                    canReorder={openReordering}
                    key={item}
                    name={truncate(layers.find((x) => x.id === item)?.name || '')}
                    item={item}
                    enabled={currentLayerPriority === layers.find((x) => x.id === item)?.id}
                  />
                )
              })}
            </Reorder.Group>
          </AnimatePresence>
        </div>
      </aside>
    </>
  )
}

export default LayerFolderSelector
