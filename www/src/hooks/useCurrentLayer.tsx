import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useQueryRepositoryLayer } from './useRepositoryFeatures'

export const useCurrentLayer = () => {
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
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
