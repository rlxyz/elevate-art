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

  const { data: collectionData } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])

  useEffect(() => {
    if (!collectionData) return
    const tokens = createManyTokens(layers, collectionData.totalSupply, collectionData.name, collectionData.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collectionData.totalSupply))
  }, [collectionData])

  if (!collectionData) return null

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <InfiniteScrollGrid />
    </CollectionViewContent>
  )
}

export default CollectionPreview
