import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import ordinal from 'ordinal'

import { useCurrentLayer } from '../../../hooks/useCurrentLayer'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import LayerGrid from './LayerGrid'

const Index = () => {
  const { currentLayer, isLoading, isError, refetch } = useCurrentLayer()
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { name, traitElements } = currentLayer

  return (
    <CollectionViewContent
      title={name}
      description={
        <span>
          There are {traitElements.length} {name} that make up the{' '}
          <span className='text-blueHighlight border-b'>{`${ordinal(currentLayerPriority + 1)} layer`}</span>
        </span>
      }
    >
      <LayerGrid traitElements={traitElements} layerName={name} />
    </CollectionViewContent>
  )
}

export default Index
