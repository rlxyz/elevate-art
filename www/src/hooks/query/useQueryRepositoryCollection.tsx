import { Collection } from '@prisma/client'
import { getTokenRanking, getTraitMappings, renderManyToken } from '@utils/compiler'
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
    const tokens = renderManyToken(layers, collection, repositoryId)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setCollectionId(collection.id)
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
  }

  return {
    current: collections?.find((c) => c.id === collectionId),
    all: collections,
    isLoading,
    isError,
    mutate,
  }
}
