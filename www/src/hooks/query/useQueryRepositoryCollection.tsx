import { Collection } from '@prisma/client'
import * as v from '@utils/compiler'
import { trpc } from '@utils/trpc'
import useRepositoryStore from '../store/useRepositoryStore'
import { useQueryRepositoryLayer } from './useQueryRepositoryLayer'

export const useQueryRepositoryCollection = () => {
  const { rarityFilter, setTraitMapping, setTokens, setTokenRanking, repositoryId, collectionId, setCollectionId } =
    useRepositoryStore((state) => {
      return {
        rarityFilter: state.rarityFilter,
        setTokens: state.setTokens,
        setTraitMapping: state.setTraitMapping,
        setTokenRanking: state.setTokenRanking,
        repositoryId: state.repositoryId,
        collectionId: state.collectionId,
        setCollectionId: state.setCollectionId,
      }
    })
  const { data: collections, isLoading, isError } = trpc.useQuery(['repository.getRepositoryCollections', { id: repositoryId }])
  const { all: layers } = useQueryRepositoryLayer()

  // update the current tokens
  const mutate = ({ collection }: { collection: Collection }) => {
    if (!layers) return

    // create tokens
    const tokens = v.many(
      v.parseLayer(
        layers.map((l) => ({
          ...l,
          traits: l.traitElements.map((t) => ({
            ...t,
            rules: [],
          })),
        }))
      ),
      Array.from({ length: collection.totalSupply }, (_, i) => v.seed(repositoryId, collection.name, collection.generations, i))
    )
    const occurances = v.occurances(tokens)
    const rarity = v.rarity(tokens)

    // set state in store
    setTraitMapping({
      traitMap: occurances,
      tokenIdMap: new Map<string, Map<string, number[]>>(),
    })
    setTokenRanking(rarity)

    setTokens(
      rarity
        .map((x) => x.index)
        .slice(
          rarityFilter === 'Top 10'
            ? 0
            : rarityFilter === 'Middle 10'
            ? parseInt((rarity.length / 2 - 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? rarity.length - 10
            : 0,
          rarityFilter === 'Top 10'
            ? 10
            : rarityFilter === 'Middle 10'
            ? parseInt((rarity.length / 2 + 5).toFixed(0))
            : rarityFilter === 'Bottom 10'
            ? rarity.length
            : rarity.length
        )
    )
    setCollectionId(collection.id)
  }

  return {
    current: collections?.find((c) => c.id === collectionId),
    all: collections,
    isLoading,
    isError,
    mutate,
  }
}
