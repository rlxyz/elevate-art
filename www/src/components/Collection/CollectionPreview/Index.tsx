import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect } from 'react'

import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const CollectionPreview = () => {
  const { setTraitMapping, setTokenRanking, layers, collection } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
      layers: state.layers,
      collection: state.collection,
    }
  })

  useEffect(() => {
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collection.totalSupply))
  }, [collection])

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
