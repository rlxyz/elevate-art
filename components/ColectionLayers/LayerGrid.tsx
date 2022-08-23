import AdvancedImage from '@components/CollectionHelpers/AdvancedImage'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/useCompilerViewStore'
import { toPascalCaseWithSpace } from '@utils/format'
import { TraitElement } from '@utils/types'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'

const LayerGrid = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  const { currentLayerPriority, currentLayer, setCurrentLayer } =
    useRepositoryStore((state) => {
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

export default LayerGrid
