import { DotsVerticalIcon } from '@heroicons/react/outline'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { LayerElement } from '@prisma/client'
import { NextRouter, useRouter } from 'next/router'
import ordinal from 'ordinal'
import { useEffect } from 'react'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import LayerGrid from './LayerGrid'
import { useCurrentLayer } from '../../hooks/useCurrentLayer'

const Index = () => {
  const { currentLayer, isLoading, isError, refetch } = useCurrentLayer()
  const currentLayerPriority = useRepositoryRouterStore((state) => state.currentLayerPriority)

  if (isLoading || !currentLayer) return <div>Loading...</div>
  if (isError) return <div>Error...</div>

  const { name, traitElements } = currentLayer

  return (
    <CollectionViewContent
      title={name}
      description={
        <span>
          There are {traitElements.length} {name} that make up the{' '}
          <span className='text-blueHighlight border-b'>{`${ordinal(
            currentLayerPriority + 1
          )} layer`}</span>
        </span>
      }
    >
      <div className='p-8'>
        <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7'>
          <LayerGrid traitElements={traitElements} layerName={name} />
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default Index
