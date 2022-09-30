import { Collection } from '@prisma/client'
import { getTokenRanking, getTraitMappings, runMany } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { NextRouter, useRouter } from 'next/router'
import { useDeepCompareEffect } from './useDeepCompareEffect'
import { useRepositoryRoute } from './useRepositoryRoute'
import useRepositoryStore from './useRepositoryStore'

export const useQueryRepository = () => {
  const router: NextRouter = useRouter()
  const { collectionName } = useRepositoryRoute()
  const repositoryName: string = router.query.repository as string
  const { data } = trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
  const { setCollectionId, setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
    }
  })

  // sync repository to store
  useDeepCompareEffect(() => {
    if (!data) return
    if (!data.collections) return
    const layers = data.layers
    const collection = data.collections?.find((collection) => collection.name === collectionName)
    if (!collection) return
    if (!layers || layers.length == 0) return
    setRepositoryId(data.id)
    setCollectionId(collection.id)
  }, [data, collectionName])

  return { data }
}

export const useQueryRepositoryLayer = () => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
}

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
    const tokens = runMany(layers, collection)
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

export const useQueryCollection = () => {
  const collectionId = useRepositoryStore((state) => state.collectionId)
  return trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
}
