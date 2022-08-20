import { DotsVerticalIcon } from '@heroicons/react/outline'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { NextRouter, useRouter } from 'next/router'
import ordinal from 'ordinal'
import { useEffect } from 'react'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import LayerGrid from './LayerGrid'

const Index = () => {
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
            <LayerGrid />
          </div>
        </div>
      </CollectionViewContent>
    )
  )
}

export default Index
