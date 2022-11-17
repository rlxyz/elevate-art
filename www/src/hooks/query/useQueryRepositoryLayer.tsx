import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { getImageForTrait } from '@utils/image'
import { sumBy } from '@utils/object-utils'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import useRepositoryStore from '../store/useRepositoryStore'

export type LayerElementWithRules = LayerElement & {
  traitElements: TraitElementWithRules[]
}
export type TraitElementWithRules = TraitElementWithImage & {
  rulesPrimary: (Rules & {
    primaryTraitElement: TraitElementWithRules
    secondaryTraitElement: TraitElementWithRules
  })[]
  rulesSecondary: (Rules & {
    primaryTraitElement: TraitElementWithRules
    secondaryTraitElement: TraitElementWithRules
  })[]
}
export type TraitElementWithImage = TraitElement & { imageUrl: string }

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

  const current = layers.find((l) => l.name === layerName) || layers[0]

  return {
    current:
      current &&
      ({
        ...current,
        traitElements: [
          {
            id: `none-${current.id}`,
            name: 'None',
            readonly: true,
            weight: 100 - sumBy(current.traitElements || 0, (x) => x.weight),
            createdAt: current.createdAt,
            updatedAt: current.updatedAt,
            layerElementId: current.id,
            rulesPrimary: [],
            rulesSecondary: [],
            imageUrl: '',
          },
          ...current.traitElements.map((x) => ({
            ...x,
            imageUrl: getImageForTrait({ r: repositoryId, l: current.id, t: x.id }),
          })),
        ] as TraitElementWithRules[],
      } as LayerElementWithRules),
    all: layers?.map((x) => ({
      ...x,
      traitElements: [
        ...x.traitElements.map((x) => ({
          ...x,
          imageUrl: getImageForTrait({ r: repositoryId, l: x.layerElementId, t: x.id }),
        })),
        {
          id: `none-${x.id}`,
          readonly: true,
          name: 'None',
          weight: 100 - sumBy(x.traitElements || 0, (x) => x.weight),
          createdAt: x.createdAt,
          updatedAt: x.updatedAt,
          layerElementId: x.id,
          rulesPrimary: [],
          rulesSecondary: [],
          imageUrl: '',
        },
      ],
    })) as LayerElementWithRules[],
    isLoading,
    isError,
  }
}
