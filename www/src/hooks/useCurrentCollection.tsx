import { useQueryRepositoryCollection } from './useRepositoryFeatures'
import useRepositoryStore from './useRepositoryStore'

export const useCurrentCollection = () => {
  const collectionId: string | null = useRepositoryStore((state) => state.collectionId)
  const { data: collections, isLoading, isError, refetch } = useQueryRepositoryCollection()
  return {
    collection: collections?.find((l) => l.id === collectionId),
    isLoading: !collections || isLoading,
    isError,
    refetch,
  }
}
