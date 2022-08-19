import FileUpload from '@components/CloudinaryImage/FileUpload'
import { Button } from '@components/UI/Button'
import {
  FolderIcon,
  RefreshIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/outline'
import { DotsHorizontalIcon, PlusIcon } from '@heroicons/react/solid'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import {
  animate,
  AnimatePresence,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as React from 'react'
import mergeImages from 'merge-images'
import { CollectionUpload } from './CollectionUpload'
import { LayerSectionEnum } from './Index'
import Image from 'next/image'
import { createCompilerApp } from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { Element } from '@utils/x/Element'
import { toPascalCaseWithSpace } from '@utils/format'

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
  onClick,
  canReorder,
}: {
  item: number
  name: string
  enabled: boolean
  canReorder: boolean
  onClick: () => void
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <a // eslint-disable-line
        className={`flex flex-row p-[4px] rounded-[5px] justify-between ${
          enabled ? 'bg-lightGray font-semibold' : 'text-darkGrey'
        }`}
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        <div className='flex'>
          <FolderIcon className='w-5 h-5' />
          <span className='ml-2 text-sm'>{name}</span>
        </div>
        {canReorder && (
          <DotsHorizontalIcon
            className='w-5 h-5'
            onPointerDown={(e) => {
              e.preventDefault()
              dragControls.start(e)
            }}
          />
        )}
      </a>
    </Reorder.Item>
  )
}

const LayerFolderSelector = () => {
  const {
    layers,
    regenerate,
    currentViewSection,
    currentLayerPriority,
    setRegenerateCollection,
    setCurrentLayerPriority,
  } = useCompilerViewStore((state) => {
    return {
      layers: state.layers,
      regenerate: state.regenerate,
      currentViewSection: state.currentViewSection,
      currentLayerPriority: state.currentLayerPriority,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const [openUpload, setOpenUpload] = useState(false)
  const [openReordering, setOpenReordering] = useState(false)
  const [refreshImage, setRefreshImage] = useState(true)
  const [currentImagePreview, setCurrentImagePreview] =
    useState<React.ReactNode>(null)

  const generateImageHandler = async (): Promise<React.ReactNode> => {
    const app: App = createCompilerApp(repositoryName)
    const imageElement: Element = app.createElementFromRandomness()
    return (
      <Image
        width={150}
        height={150}
        className='rounded-md'
        src={await mergeImages(
          imageElement
            .toAttributes()
            .map(
              (attribute) =>
                `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES
                    ? 'c_fill,h_300,w_300'
                    : ''
                }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                  attribute['trait_type']
                )}/${toPascalCaseWithSpace(attribute['value'])}.png`
            ),
          { crossOrigin: 'Anonymous' }
        )}
      />
    )
  }

  useEffect(() => {
    refreshImage &&
      generateImageHandler()
        .then((data) => {
          setCurrentImagePreview(data)
        })
        .then(() => {
          setRefreshImage(false)
        })
  }, [refreshImage])

  useEffect(() => {
    setItems(Array.from(Array(layers.length).keys()))
  }, [layers])

  return (
    layers &&
    layers.length > 0 && (
      <main className='px-8 pt-8 space-y-6'>
        <div className='flex flex-col space-y-6 justify-between'>
          <div className='space-y-2'>
            <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
              {'Generate'}
            </span>
            <div>
              <Button
                onClick={() => {
                  !regenerate && setRegenerateCollection(true)
                }}
              >
                <span className='p-2 flex items-center justify-center space-x-1'>
                  <RefreshIcon className='w-5 h-5' />
                  <span>Generate</span>
                </span>
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
                {layers.length === 1 ? 'Layer' : 'Layers'}
              </span>
              <div className='space-x-1'>
                <button onClick={() => setOpenReordering(!openReordering)}>
                  <div className='border rounded-[5px] border-lightGray p-1'>
                    <SwitchVerticalIcon className='text-darkGrey w-3 h-3' />
                  </div>
                </button>
                <button
                  onClick={() => {
                    setOpenUpload(true)
                  }}
                >
                  <div className='border rounded-[5px] border-lightGray p-1'>
                    <PlusIcon className='text-darkGrey w-3 h-3' />
                  </div>
                </button>
              </div>
            </div>
            <div className='border border-lightGray rounded-[5px] max-h-[calc(100vh-42.5rem)] overflow-y-scroll'>
              <FileUpload id={`${organisationName}/${repositoryName}`}>
                <AnimatePresence>
                  <Reorder.Group
                    axis='y'
                    values={items}
                    onReorder={setItems}
                    className='space-y-2 m-2'
                  >
                    {items.map((item) => {
                      return (
                        <ReorderItem
                          canReorder={openReordering}
                          key={item}
                          name={layers[item]?.name}
                          item={item}
                          enabled={currentLayerPriority === item}
                          onClick={() => {
                            setCurrentLayerPriority(item)
                          }}
                        />
                      )
                    })}
                  </Reorder.Group>
                </AnimatePresence>
              </FileUpload>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='col-span-4 text-xs font-normal text-darkGrey uppercase'>
                {'Preview'}
              </span>
              <button
                onClick={() => {
                  setRefreshImage(true)
                }}
              >
                <div className='border rounded-[5px] border-lightGray p-1'>
                  <RefreshIcon className='text-darkGrey w-3 h-3' />
                </div>
              </button>
            </div>
            <div className='border border-lightGray p-2 rounded-[5px]'>
              <div className='flex overflow-x-scroll overflow-x-auto space-x-3'>
                <div className='border border-lightGray rounded-[5px]'>
                  {currentImagePreview}
                </div>
                <div className='border border-lightGray rounded-[5px]'>
                  {currentImagePreview}
                </div>
              </div>
            </div>
          </div>
          <CollectionUpload open={openUpload} setOpen={setOpenUpload} />
        </div>
        {/* {currentViewSection === LayerSectionEnum.RULES && (
          <div>
            <span className='text-xs font-semibold text-darkGrey uppercase'>
              Custom Rules
            </span>
          </div>
        )} */}
        {/* todo: implement search */}
        {/* <Textbox
          id='search-trait'
          name='search-trait'
          placeholder='Search Trait'
        /> */}
      </main>
    )
  )
}

export default LayerFolderSelector
