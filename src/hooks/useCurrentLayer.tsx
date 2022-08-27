import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerElement } from '@prisma/client'
import { trpc } from '@utils/trpc'

export const useCurrentLayer = () => {
  const layers = useRepositoryStore((state) => state.layers)

  layers.forEach((layer: LayerElement) => {
    trpc.useQuery([
      'layer.getLayerById',
      {
        id: layer.id,
      },
    ])
  })

  const currentLayerPriority: number = useRepositoryRouterStore(
    (state) => state.currentLayerPriority
  )

  const currentLayerPriorityId: string = layers[currentLayerPriority]?.id || ''

  const { data, isLoading, isError, refetch } = trpc.useQuery([
    'layer.getLayerById',
    {
      id: currentLayerPriorityId,
    },
  ])

  return { currentLayer: data, isLoading: !data || isLoading, isError, refetch }
}
