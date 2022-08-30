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
      <LayerGrid traitElements={traitElements} layerName={name} />
    </CollectionViewContent>
  )
}

export default Index
