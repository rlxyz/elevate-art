import { Collection } from '@prisma/client'
import { getTokenRanking, getTraitMappings, renderManyToken } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { useQueryRepositoryLayer } from './useQueryRepositoryLayer'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryRepositoryCollection = () => {
  const { setTraitMapping, setTokenRanking, repositoryId, collectionId, setCollectionId } = useRepositoryStore((state) => {
    return {
      setTraitMapping: state.setTraitMapping,
      setTokenRanking: state.setTokenRanking,
      repositoryId: state.repositoryId,
      collectionId: state.collectionId,
      setCollectionId: state.setCollectionId,
    }
  })
  const { data: layers } = useQueryRepositoryLayer()

  // update the current tokens
  const mutate = ({ collection }: { collection: Collection }) => {
    if (!layers) return
    const tokens = renderManyToken(layers, collection)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setCollectionId(collection.id)
    setTokenRanking(rankings)
  }

  const { data: collections, isLoading, isError } = trpc.useQuery(['repository.getRepositoryCollections', { id: repositoryId }])
  return {
    current: collections?.find((c) => c.id === collectionId),
    all: collections,
    isLoading,
    isError,
    mutate,
  }
}
