import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const Index = () => {
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      {collection && layers && <InfiniteScrollGrid collection={collection} layers={layers} />}
    </CollectionViewContent>
  )
}

export default Index
