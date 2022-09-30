import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import { trpc } from '@utils/trpc'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryRepositoryLayer = () => {
  const currentLayerPriority: string | null = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers, isLoading, isError } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  return {
    current: layers?.find((l) => l.id === currentLayerPriority),
    all: layers,
    isLoading,
    isError,
  }
}
