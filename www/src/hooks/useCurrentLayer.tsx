import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useQueryRepositoryLayer } from './useRepositoryFeatures'

export const useCurrentLayer = () => {
  const currentLayerPriority: number = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { data: layers, isLoading, isError, refetch } = useQueryRepositoryLayer()
  return {
    currentLayer: layers?.find((l) => l.priority === currentLayerPriority) || {
      id: '',
      name: '',
      traitElements: [],
    },
    isLoading: !layers || isLoading,
    isError,
    refetch,
  }
}
