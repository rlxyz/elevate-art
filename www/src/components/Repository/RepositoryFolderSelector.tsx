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
}: {
  item: string
  name: string
  enabled: boolean
  canReorder: boolean
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  return (
    <Reorder.Item value={item} id={item.toString()} style={{ boxShadow, y }} dragListener={false} dragControls={dragControls}>
      <Link href={`/${organisationName}/${repositoryName}/${currentViewSection}/${name}`} enabled={enabled} hover title={name}>
        {canReorder && (
          <DotsHorizontalIcon
            className='text-darkGrey mr-1 w-4 h-4'
            onPointerDown={(e) => {
              e.preventDefault()
              dragControls.start(e)
            }}
          />
        )}
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
    <aside className='space-y-1'>
      <div className='flex items-center justify-between'>
        <div />
        <div className='space-x-1 flex items-center'>
          <button
            onClick={() => {
              if (!openReordering) {
                setOpenReordering(true)
              } else {
                reorderLayer({ layerIdsInOrder: items })
                setOpenReordering(false)
              }
            }}
            className={clsx(
              'border rounded-[5px] border-mediumGrey p-1 text-darkGrey',
              openReordering && 'border-blueHighlight text-blueHighlight'
            )}
          >
            <SwitchVerticalIcon className='w-3 h-3 text-darkGrey' />
          </button>
        </div>
      </div>
      <div className='space-y-2 border border-mediumGrey rounded-[5px] p-1'>
        <div className='max-h-[calc(100vh-17.5rem)]'>
          <AnimatePresence>
            <Reorder.Group axis='y' layoutScroll style={{ overflowY: 'scroll' }} onReorder={setItems} values={items}>
              {items.map((item) => {
                return (
                  <ReorderItem
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
      </div>
    </aside>
  )
}

export default LayerFolderSelector
