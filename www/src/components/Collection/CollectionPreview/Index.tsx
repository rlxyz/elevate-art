import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect } from 'react'

import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { isEqual } from 'lodash'
import { useRef } from 'react'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

export function useDeepEqualMemo<T>(value: T) {
  const ref = useRef<T | undefined>(undefined)

  if (!isEqual(ref.current, value)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(callback: () => void, dependencies: any) {
  useEffect(callback, dependencies.map(useDeepEqualMemo))
}

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
  const { setTraitMapping, setTokenRanking } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })

  useDeepCompareEffect(() => {
    if (!collection || !layers) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collection.totalSupply))
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
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }], {
    onSuccess: (data) => console.log({ data }),
  })

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
