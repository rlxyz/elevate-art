import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect } from 'react'

import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const CollectionPreview = () => {
  const {
    setTraitMapping,
    setTokenRanking,
    setRegenerateCollection,
    layers,
    collection,
    regenerate,
  } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
      setRegenerateCollection: state.setRegenerateCollection,
      regenerate: state.regenerate,
      layers: state.layers,
      collection: state.collection,
    }
  })

  const { data: collectionData } = trpc.useQuery([
    'collection.getCollectionById',
    { id: collection.id },
  ])

  useEffect(() => {
    if (!collectionData) return
    const tokens = createManyTokens(
      layers,
      collectionData.totalSupply,
      collectionData.name,
      collectionData.generations
    )
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    console.log({ tokenIdMap, traitMap })
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collectionData.totalSupply))
  }, [collectionData])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <InfiniteScrollGrid collectionId={collection.id} />
    </CollectionViewContent>
  )
}

export default CollectionPreview
