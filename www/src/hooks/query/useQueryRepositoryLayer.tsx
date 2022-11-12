import { sumBy } from '@utils/object-utils'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import useRepositoryStore from '../store/useRepositoryStore'

export const useQueryRepositoryLayer = () => {
  const router = useRouter()
  const layerName = router.query.layer
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers, isLoading, isError } = trpc.useQuery(['layers.getAll', { id: repositoryId }])

  if (!layers)
    return {
      current: undefined,
      all: [],
      isLoading,
      isError,
    }

  const current = layers.find((l) => l.name === layerName)

  return {
    current:
      (current && {
        ...current,
        traitElements: [
          {
            id: `none-${current.id}`,
            name: 'None',
            readonly: true,
            weight: 100 - sumBy(current.traitElements || 0, (x) => x.weight),
            createdAt: new Date(),
            updatedAt: new Date(),
            layerElementId: current.id,
            rulesPrimary: [],
            rulesSecondary: [],
          },
          ...current.traitElements,
        ],
      }) ||
      (layers && layers[0]),
    all: layers?.map((x) => ({
      ...x,
      traitElements: [
        ...x.traitElements,
        {
          id: `none-${x.id}`,
          readonly: true,
          name: 'None',
          weight: 100 - sumBy(x.traitElements || 0, (x) => x.weight),
          createdAt: new Date(),
          updatedAt: new Date(),
          layerElementId: x.id,
          rulesPrimary: [],
          rulesSecondary: [],
        },
      ],
    })),
    isLoading,
    isError,
  }
}
