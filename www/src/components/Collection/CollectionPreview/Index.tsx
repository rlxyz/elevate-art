import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'

import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const CollectionPreviewImplementation = ({
  layers,
  collection,
}: {
  collection: Collection
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
    })[]
  })[]
}) => {
  const { setTokens, tokenRanking, setTraitMapping, rarityFilter, setTokenRanking } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      rarityFilter: state.rarityFilter,
      setTokens: state.setTokens,
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })

  useDeepCompareEffect(() => {
    if (!collection || !layers) return
    // if (tokenRanking) return // stops the compiler from running again
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setTokenRanking(rankings)
    setTokens(
      rankings.slice(
        rarityFilter === 'Top 10'
          ? 0
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 - 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length - 10
          : 0,
        rarityFilter === 'Top 10'
          ? 10
          : rarityFilter === 'Middle 10'
          ? parseInt((rankings.length / 2 + 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? rankings.length
          : rankings.length
      )
    )
  }, [layers, collection])

  return <InfiniteScrollGrid collection={collection} layers={layers} />
}

const Index = () => {
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      {collection && layers && <CollectionPreviewImplementation collection={collection} layers={layers} />}
    </CollectionViewContent>
  )
}

export default Index
