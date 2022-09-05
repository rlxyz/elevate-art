import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { TraitElement } from '@prisma/client'
import { toPascalCaseWithSpace } from '@utils/format'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'

const LayerGridLoading = () => {
  return (
    <>
      {Array.from(Array(10).keys()).map((index) => {
        return (
          <div key={`${index}`} className='flex flex-col items-center opacity-70'>
            <div className='z-1'>
              <AdvancedImage url='/images/logo.png' />
            </div>
            <span className='py-2 text-xs invisible'>{'...'}</span>
          </div>
        )
      })}
    </>
  )
}

const LayerGrid = ({
  traitElements,
  layerName,
}: {
  traitElements: TraitElement[]
  layerName: string
}) => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [show, setShow] = useState<number | null>(null)

  return (
    <div className='grid grid-cols-6 gap-x-8 gap-y-8'>
      {!traitElements.length ? (
        <LayerGridLoading />
      ) : (
        traitElements.map((trait: TraitElement, index: number) => {
          return (
            <div key={`${trait.name}-${index}`} className='flex flex-col items-center'>
              <button
                onMouseEnter={() => {
                  setShow(index)
                }}
                onMouseLeave={() => {
                  setShow(null)
                }}
                className='relative'
              >
                <div className={`absolute z-10 right-0 p-1 ${show === index ? '' : 'hidden'}`}>
                  <div className='bg-hue-light rounded-[3px] w-5 h-5 flex items-center justify-center'>
                    <DotsHorizontalIcon className='w-3 h-3 text-mediumGrey' />
                  </div>
                </div>
                <div className='z-1'>
                  <AdvancedImage
                    url={`${organisationName}/${repositoryName}/layers/${layerName}/${toPascalCaseWithSpace(
                      trait.name
                    )}.png`}
                  />
                </div>
              </button>
              <span className='py-2 text-xs'>{toPascalCaseWithSpace(trait.name)}</span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default LayerGrid
