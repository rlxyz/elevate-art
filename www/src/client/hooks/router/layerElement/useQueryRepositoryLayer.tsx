import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { useRouter } from 'next/router'
import { getImageForTrait } from 'src/client/utils/image'
import { trpc } from 'src/client/utils/trpc'
import { RulesType } from 'src/shared/compiler'
import { sumBy } from 'src/shared/object-utils'
import useRepositoryStore from '../../store/useRepositoryStore'

export type LayerElementWithRules = LayerElement & {
  traitElements: TraitElementWithRules[]
}

export type TraitElementRule = Rules & { condition: RulesType }

export type TraitElementWithRules = TraitElementWithImage & {
  rulesPrimary: (TraitElementRule & {
    primaryTraitElement: TraitElementWithRules
    secondaryTraitElement: TraitElementWithRules
  })[]
  rulesSecondary: (TraitElementRule & {
    primaryTraitElement: TraitElementWithRules
    secondaryTraitElement: TraitElementWithRules
  })[]
}

export type TraitElementWithImage = TraitElement & { imageUrl: string; readonly: boolean }

export const useQueryRepositoryLayer = () => {
  const router = useRouter()
  const layerName = router.query.layer
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers, isLoading, isError } = trpc.layerElement.findAll.useQuery({ repositoryId }, { enabled: !!repositoryId })

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
            readonly: false,
          })),
        ] as TraitElementWithRules[],
      } as LayerElementWithRules),
    all: layers.map((x) => ({
      ...x,
      traitElements: [
        ...x.traitElements.map((x) => ({
          ...x,
          rulesPrimary: x.rulesPrimary.map((r) => ({ ...r, condition: r.condition as RulesType })),
          rulesSecondary: x.rulesSecondary.map((r) => ({ ...r, condition: r.condition as RulesType })),
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
