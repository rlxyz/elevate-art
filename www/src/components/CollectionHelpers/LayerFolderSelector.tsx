import FileUpload from '@components/CollectionHelpers/FileUpload'
import { Link } from '@components/UI/Link'
import { DotsHorizontalIcon } from '@heroicons/react/solid'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import {
  animate,
  AnimatePresence,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue
} from 'framer-motion'
import router, { NextRouter, useRouter } from 'next/router'
import * as React from 'react'
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
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <Link
        href={`/${organisationName}/${repositoryName}/tree/${collectionName}/${currentViewSection}/${name}`}
        enabled={enabled}
        hover
        title={name}
      >
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
  const {
    layers,
    regenerate,
    regeneratePreview,
    setRegeneratePreview,
    setRegenerateCollection,
    organisation,
    repository,
  } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      organisation: state.organisation,
      repository: state.repository,
      regenerate: state.regenerate,
      regeneratePreview: state.regeneratePreview,
      setRegeneratePreview: state.setRegeneratePreview,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  const { currentLayerPriority } = useRepositoryRouterStore((state) => {
    return {
      currentLayerPriority: state.currentLayerPriority,
    }
  })

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [items, setItems] = useState(layers.map((layer) => layer.id))
  const [openUpload, setOpenUpload] = useState(false)
  const [openReordering, setOpenReordering] = useState(false)
  const [refreshImage, setRefreshImage] = useState(true)
  const [expandPreview, setExpandPreview] = useState(false)
  const [currentImagePreviews, setCurrentImagePreviews] = useState<React.ReactNode[]>([])

  // const generateImageHandler = async (): Promise<React.ReactNode[]> => {
  //   const app: App = createCompilerApp(repository.name)
  //   return Array.from(Array(30).keys()).map(async () => {
  //     const imageElement: Element = app.createElementFromRandomness()
  //     return (
  //       <Image
  //         width={100}
  //         height={100}
  //         className='rounded-md'
  //         src={await mergeImages(
  //           imageElement
  //             .toAttributes()
  //             .map(
  //               (attribute) =>
  //                 `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
  //                   process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES ? 'c_fill,h_300,w_300' : ''
  //                 }/v1/${organisation.name}/${repository.name}/layers/${toPascalCaseWithSpace(
  //                   attribute['trait_type']
  //                 )}/${toPascalCaseWithSpace(attribute['value'])}.png`
  //             ),
  //           { crossOrigin: 'Anonymous' }
  //         )}
  //       />
  //     )
  //   })
  // }

  // useEffect(() => {
  //   ;(refreshImage || regeneratePreview) &&
  //     generateImageHandler()
  //       .then((data) => {
  //         Promise.all(data).then((images) => {
  //           setCurrentImagePreviews(images)
  //         })
  //       })
  //       .then(() => {
  //         setRefreshImage(false)
  //         setRegeneratePreview(false)
  //       })
  // }, [refreshImage, regeneratePreview])

  // useEffect(() => {
  //   setItems(Array.from(Array(layers.length).keys()))
  // }, [layers])

  return (
    <aside>
      {layers && layers.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            {/* <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
              {layers.length === 1 ? 'Layer' : 'Layers'}
            </span> */}
            <div className='space-x-1 flex items-center'>
              {/* <button onClick={() => setOpenReordering(!openReordering)}>
                  <div className='border rounded-[5px] border-lightGray p-1'>
                    <SwitchVerticalIcon className='text-darkGrey w-2 h-2' />
                  </div>
                </button> */}
              {/* <button
                  onClick={() => {
                    setOpenUpload(true)
                  }}
                >
                  <div className='border rounded-[5px] border-lightGray p-1'>
                    <PlusIcon className='text-darkGrey w-2 h-2' />
                  </div>
                </button> */}
            </div>
          </div>
          <div className='max-h-[calc(100vh-17.5rem)] overflow-y-scroll'>
            <FileUpload id={`${organisationName}/${repositoryName}`}>
              <AnimatePresence>
                <Reorder.Group
                  axis='y'
                  values={items}
                  onReorder={setItems}
                  // className='space-y-3'
                >
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
            </FileUpload>
          </div>
        </div>
      )}
      {/* <footer className='bg-hue-light fixed left-0 bottom-0 pl-8 py-4 space-y-2 border-t border-lightGray'> */}
      {/* <footer className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
              {'Preview'}
            </span>
            <div className='flex space-x-1'>
              <button
                onClick={() => {
                  setRefreshImage(true)
                }}
              >
                <div className='border rounded-[5px] border-lightGray p-1'>
                  <RefreshIcon className='text-darkGrey w-3 h-3' />
                </div>
              </button>
              <button
                onClick={() => {
                  setExpandPreview(!expandPreview)
                }}
              >
                <div className='border rounded-[5px] border-lightGray p-1'>
                  <ArrowsExpandIcon className='text-darkGrey w-3 h-3' />
                </div>
              </button>
            </div>
          </div>
          <div
            className={`flex overflow-x-scroll no-scrollbar border border-lightGray p-2 rounded-[5px] ${
              expandPreview ? 'w-[calc(100vw-4rem)]' : ''
            } space-x-2`}
          >
            {currentImagePreviews?.map((images, index) => {
              return (
                <div
                  key={index}
                  className='border border-lightGray rounded-[5px] min-h-[100px] min-w-[100px] max-h-[100px]'
                >
                  {images}
                </div>
              )
            })}
          </div>
          <CollectionUpload open={openUpload} setOpen={setOpenUpload} />
        </footer> */}
    </aside>
  )
}

export default LayerFolderSelector
