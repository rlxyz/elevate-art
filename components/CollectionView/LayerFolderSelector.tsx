import FileUpload from '@components/CloudinaryImage/FileUpload'
import { Button } from '@components/UI/Button'
import { CubeIcon, FolderIcon, SelectorIcon } from '@heroicons/react/outline'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { NextRouter, useRouter } from 'next/router'
import { LayerSectionEnum } from './Index'
import { AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import { useState } from 'react'
import * as React from 'react'
import { animate, MotionValue, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { CollectionUpload } from './CollectionUpload'

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
}: {
  item: number
  name: string
  enabled: boolean
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
        className={`flex flex-row p-[4px] my-2 rounded-[5px] justify-between ${
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
        <DotsHorizontalIcon
          className='w-5 h-5'
          onPointerDown={(e) => {
            e.preventDefault()
            dragControls.start(e)
          }}
        />
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

  useEffect(() => {
    setItems(Array.from(Array(layers.length).keys()))
  }, [layers])

  return (
    layers &&
    layers.length > 0 && (
      // calc(100vh-13rem) is the height of the Header & ViewContent
      <main className='p-8'>
        <div className='mb-8 h-10'>
          <Button
            onClick={() => {
              !regenerate && setRegenerateCollection(true)
            }}
          >
            Generate New
          </Button>
        </div>
        <div className='mb-8 h-10'>
          <Button
            onClick={() => {
              setOpenUpload(true)
            }}
          >
            Upload Files
          </Button>
          <CollectionUpload open={openUpload} setOpen={setOpenUpload} />
        </div>
        <div
          className={`pb-4 mb-4 ${
            currentViewSection === LayerSectionEnum.RULES
              ? 'border-b border-b-lightGray'
              : ''
          }`}
        >
          <span className='text-xs font-semibold text-darkGrey uppercase'>
            {layers.length === 1 ? 'Layer' : 'Layers'}
          </span>
          <div className='mt-4 border border-lightGray rounded-[5px] p-2'>
            <FileUpload id={`${organisationName}/${repositoryName}`}>
              <AnimatePresence>
                <Reorder.Group axis='y' values={items} onReorder={setItems}>
                  {items.map((item) => {
                    return (
                      <ReorderItem
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
