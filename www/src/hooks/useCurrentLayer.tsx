import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'

export const useCurrentLayer = () => {
  const layerIds = useRepositoryStore((state) => state.layerIds)
  const currentLayerPriority: number = useRepositoryRouterStore((state) => state.currentLayerPriority)
  const currentLayerPriorityId: string = layerIds[currentLayerPriority] || ''

  const { data, isLoading, isError, refetch } = trpc.useQuery([
    'layer.getLayerById',
    {
      id: currentLayerPriorityId,
    },
  ])

  layerIds.forEach((id: string) => {
    trpc.useQuery(['layer.getLayerById', { id }])
  })

  return {
    currentLayer: data || {
      id: '',
      name: '',
      traitElements: [],
    },
    isLoading: !data || isLoading,
    isError,
    refetch,
  }
}
