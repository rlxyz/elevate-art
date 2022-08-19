import AdvancedImage from '@components/CloudinaryImage/AdvancedImage'
import { DotsHorizontalIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { toPascalCaseWithSpace } from '@utils/format'
import { TraitElement } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import ordinal from 'ordinal'
import { useEffect, useState } from 'react'

import { CollectionViewContent } from './ViewContent'

const CollectionImagesGrid = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  const { currentLayerPriority, currentLayer, setCurrentLayer } =
    useCompilerViewStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentLayer: state.currentLayer,
        setCurrentLayer: state.setCurrentLayer,
      }
    })
  const [show, setShow] = useState(null)

  return (
    <>
      {currentLayer.traits.map((trait: TraitElement, index: number) => {
        return (
          <div
            key={`${trait.name}-${index}`}
            className='flex flex-col items-center'
          >
            <button
              onMouseEnter={() => {
                setShow(index)
              }}
              onMouseLeave={() => {
                setShow(null)
              }}
              className='relative'
            >
              <div
                className={`absolute z-10 right-0 p-1 ${
                  show === index ? '' : 'hidden'
                }`}
              >
                <div className='bg-hue-light rounded-[3px] w-5 h-5 flex items-center justify-center'>
                  <DotsHorizontalIcon className='w-3 h-3 text-lightGray' />
                </div>
              </div>
              <div className='z-1'>
                <AdvancedImage
                  url={`${organisationName}/${repositoryName}/layers/${
                    currentLayer.name
                  }/${toPascalCaseWithSpace(trait.name)}.png`}
                />
              </div>
            </button>
            <span className='py-2 text-xs'>
              {toPascalCaseWithSpace(trait.name)}
            </span>
          </div>
        )
      })}
    </>
  )
}

const CollectionImagesView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { currentLayerPriority, currentLayer, setCurrentLayer } =
    useCompilerViewStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentLayer: state.currentLayer,
        setCurrentLayer: state.setCurrentLayer,
      }
    })

  useEffect(() => {
    setCurrentLayer(currentLayerPriority)
  }, [currentLayerPriority])

  return (
    currentLayer && (
      <CollectionViewContent
        title={currentLayer.name}
        description={
          <span>
            There are {currentLayer.traits.length} {currentLayer.name} that make
            up the{' '}
            <span className='text-blueHighlight border-b'>{`${ordinal(
              currentLayerPriority + 1
            )} layer`}</span>
          </span>
        }
      >
        <div className='p-8'>
          <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7'>
            <CollectionImagesGrid />
          </div>
        </div>
      </CollectionViewContent>
    )
  )
}

export default CollectionImagesView
