import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import { useQueryRepositoryLayer } from './query/useQueryRepositoryLayer'

export const useCurrentLayer = () => {
  const currentLayerPriority: string | null = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { data: layers, isLoading, isError, refetch } = useQueryRepositoryLayer()
  return {
    currentLayer: layers?.find((l) => l.id === currentLayerPriority) || {
      id: '',
      name: '',
      traitElements: [],
    },
    isLoading: !layers || isLoading,
    isError,
    refetch,
  }
}
