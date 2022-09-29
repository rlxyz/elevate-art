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
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useQuery(['repository.getRepositoryCollections', { id: repositoryId }])
}

export const useQueryCollection = () => {
  const collectionId = useRepositoryStore((state) => state.collectionId)
  return trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
}
