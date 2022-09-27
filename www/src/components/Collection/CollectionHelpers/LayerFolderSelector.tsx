import { Link } from '@components/UI/Link'
import { DotsHorizontalIcon, PlusIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import { animate, AnimatePresence, MotionValue, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import produce from 'immer'
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

const LayerFolderSelector = ({ layers }: { layers: LayerElement[] }) => {
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const [setReordered, setSetReordered] = useState('some_random_reordering')
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [items, setItems] = useState<string[]>(layers.map((x) => x.id))
  const [openUpload, setOpenUpload] = useState(false)
  const [openReordering, setOpenReordering] = useState(false)
  const ctx = trpc.useContext()

  const { mutate: reorderLayer } = trpc.useMutation('layer.reorder', {
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: input.repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }])
      if (!backup) return { backup }

      const { layerIdsInOrder } = input

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        layerIdsInOrder.forEach((id, index) => {
          const layer = draft.find((l) => l.id === id)
          if (layer) {
            layer.priority = index
          }
        })
        draft.sort((a, b) => a.priority - b.priority)
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }], next)

      // return backup
      return { backup }
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: variables.repositoryId }], context.backup)
    },
  })

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
                reorderLayer({
                  layerIdsInOrder: items,
                  repositoryId,
                })
                setOpenReordering(false)
              }
            }}
            className={clsx(
              'border rounded-[5px] border-mediumGrey p-1 text-darkGrey',
              openReordering && 'border-blueHighlight text-blueHighlight'
            )}
          >
            <SwitchVerticalIcon className='w-2 h-2' />
          </button>
          <button
            onClick={() => {
              setOpenUpload(true)
            }}
            className='border rounded-[5px] border-mediumGrey p-1'
          >
            <PlusIcon className='text-darkGrey w-2 h-2' />
          </button>
        </div>
      </div>
      <div className='space-y-2 border border-mediumGrey rounded-[5px] p-1'>
        <div className='max-h-[calc(100vh-17.5rem)]'>
          <AnimatePresence>
            <Reorder.Group axis='y' layoutScroll style={{ overflowY: 'scroll' }} onReorder={setItems} values={items}>
              {items.map((item, index) => {
                return (
                  <ReorderItem
                    canReorder={openReordering}
                    key={item}
                    name={layers.find((x) => x.id === item)?.name || ''}
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
