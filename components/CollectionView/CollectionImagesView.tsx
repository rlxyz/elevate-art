import { LayerElement, TraitElement } from '@utils/types'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { formatLayerName } from '@utils/format'
import { useEffect, useState } from 'react'
import ordinal from 'ordinal'
import { createCloudinary } from '@utils/cloudinary'
import { NextRouter, useRouter } from 'next/router'
import AdvancedImage from '@components/CloudinaryImage/AdvancedImage'
import { CollectionViewContent } from './ViewContent'
import { Button } from '@components/UI/Button'

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
            {currentLayer.traits.map((trait: TraitElement, index: number) => {
              return (
                <div
                  key={`${trait.name}-${index}`}
                  className='flex flex-col items-center'
                >
                  <AdvancedImage
                    height={125}
                    width={125}
                    url={`${organisationName}/${repositoryName}/layers/${
                      currentLayer.name
                    }/${formatLayerName(trait.name)}.png`}
                  />
                  <span className='py-2 text-xs'>
                    {formatLayerName(trait.name)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CollectionViewContent>
    )
  )
}

export default CollectionImagesView
