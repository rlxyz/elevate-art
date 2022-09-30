import { useTokens } from '@hooks/useTokens'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const Index = () => {
  const { tokens } = useTokens()
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
