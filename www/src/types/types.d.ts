import { Rules, TraitElement } from '@prisma/client'

declare global {
  type LayerElements = (LayerElement & { traitElements: TraitElements })[]
  type TraitElements = (TraitElement & {
    rulesSecondary: (Rules & {
      secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      primaryTraitElement: TraitElement & { layerElement: LayerElement }
    })[]
    rulesPrimary: (Rules & {
      secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      primaryTraitElement: TraitElement & { layerElement: LayerElement }
    })[]
  })[]
}
