import useRepositoryStore from '@hooks/useRepositoryStore'

import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { trpc } from '@utils/trpc'
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
  const { setTokens, setTraitMapping, rarityFilter, setTokenRanking } = useRepositoryStore((state) => {
    return {
      rarityFilter: state.rarityFilter,
      setTokens: state.setTokens,
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })

  useDeepCompareEffect(() => {
    if (!collection || !layers) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    console.log(tokens)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const tokenRanking = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setTokenRanking(tokenRanking)
    setTokens(
      tokenRanking.slice(
        rarityFilter === 'Top 10'
          ? 0
          : rarityFilter === 'Middle 10'
          ? parseInt((tokenRanking.length / 2 - 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? tokenRanking.length - 10
          : 0,
        rarityFilter === 'Top 10'
          ? 10
          : rarityFilter === 'Middle 10'
          ? parseInt((tokenRanking.length / 2 + 5).toFixed(0))
          : rarityFilter === 'Bottom 10'
          ? tokenRanking.length
          : tokenRanking.length
      )
    )
  }, [layers, collection])

  return <InfiniteScrollGrid collection={collection} layers={layers} />
}

const Index = () => {
  const { collectionId, repositoryId } = useRepositoryStore((state) => {
    return {
      collectionId: state.collectionId,
      repositoryId: state.repositoryId,
    }
  })

  const { data: collection } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])

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
