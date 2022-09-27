import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import { useQueryRepositoryLayer } from './useRepositoryFeatures'

export const useCurrentLayer = () => {
  const currentLayerPriority: string = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { data: layers, isLoading, isError, refetch } = useQueryRepositoryLayer()
  console.log({ currentLayerPriority })
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
