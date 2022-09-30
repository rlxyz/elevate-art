import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const Index = () => {
  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <InfiniteScrollGrid />
    </CollectionViewContent>
  )
}

export default Index
