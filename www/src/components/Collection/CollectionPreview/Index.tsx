import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect } from 'react'

import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const CollectionPreview = () => {
  const { setTraitMapping, setTokenRanking, layers, collectionId } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
      layers: state.layers,
      collectionId: state.collectionId,
    }
  })

  const { data: collection, isLoading, isError } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])

  useEffect(() => {
    if (!collection) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collection.totalSupply))
  }, [collection])

  if (isLoading || isError || !collection) return null

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <InfiniteScrollGrid collection={collection} />
    </CollectionViewContent>
  )
}

export default CollectionPreview
