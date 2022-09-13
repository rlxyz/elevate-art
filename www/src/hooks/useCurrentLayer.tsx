import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'

export const useRepositoryLayers = () => {
  const layerIds = useRepositoryStore((state) => state.layerIds)
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const {
    data: layers,
    isLoading,
    isError,
    refetch,
  } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
  const ctx = trpc.useContext()

  // const setQueryData = (layerId: number) => {
  //   ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], (data) => {
  //     if (!data) return []
  //     return data.filter((layer) => layer.id !== layerId)
  //   })
  // }

  return {
    layers,
    isLoading,
    isError,
    refetch,
  }
}

export const useCurrentLayer = () => {
  const layerIds = useRepositoryStore((state) => state.layerIds)
  const currentLayerPriority: number = useCollectionNavigationStore((state) => state.currentLayerPriority)
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
