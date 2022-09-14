import { Link } from '@components/UI/Link'
import { DotsHorizontalIcon } from '@heroicons/react/solid'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import { animate, AnimatePresence, MotionValue, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import router, { NextRouter, useRouter } from 'next/router'
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
  id,
}: {
  item: number
  name: string
  enabled: boolean
  id: string
  canReorder: boolean
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string

  return (
    <Reorder.Item value={item} id={item.toString()} style={{ boxShadow, y }} dragListener={false} dragControls={dragControls}>
      <Link href={`/${organisationName}/${repositoryName}/${currentViewSection}/${name}`} enabled={enabled} hover title={name}>
        {canReorder && (
          <DotsHorizontalIcon
            className='ml-1 w-5 h-5'
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
  const { data: layers } = useQueryRepositoryLayer()
  const { currentLayerPriority } = useCollectionNavigationStore((state) => {
    return {
      currentLayerPriority: state.currentLayerPriority,
    }
  })
  const router: NextRouter = useRouter()
  const [items, setItems] = useState<string[]>()
  const [openUpload, setOpenUpload] = useState(false)
  const [openReordering, setOpenReordering] = useState(false)

  useEffect(() => {
    if (!layers) return
    setItems(layers.map((layer) => layer.id))
  }, [layers])

  if (!layers || !items) return null

  return (
    <aside>
      <div className='space-y-2 border border-mediumGrey rounded-[5px] p-1'>
        {/* <div className='flex items-center justify-between'>
          <div className='space-x-1 flex items-center'>
            <button onClick={() => setOpenReordering(!openReordering)}>
                  <div className='border rounded-[5px] border-lightGray p-1'>
                  <SwitchVerticalIcon className='text-darkGrey w-2 h-2' />
                  </div>
                </button>
            <button
                onClick={() => {
                  setOpenUpload(true)
                }}
                >
                <div className='border rounded-[5px] border-lightGray p-1'>
                <PlusIcon className='text-darkGrey w-2 h-2' />
                </div>
              </button>
          </div>
        </div> */}
        <div className='max-h-[calc(100vh-17.5rem)]'>
          <AnimatePresence>
            <Reorder.Group axis='y' values={items} onReorder={setItems}>
              {items.map((item, index) => {
                return (
                  <ReorderItem
                    canReorder={openReordering}
                    key={item}
                    name={layers[index]?.name || ''}
                    item={index}
                    id={item}
                    enabled={currentLayerPriority === index}
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
