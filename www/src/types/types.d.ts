import { Rules, TraitElement } from '@prisma/client'

declare global {
  type LayerElements = (LayerElement & { traitElements: TraitElements })[]
  type TraitElements = (TraitElement & {
    rulesSecondary: (Rules & {
      secondaryTraitElement: TraitElement
      primaryTraitElement: TraitElement
    })[]
    rulesPrimary: (Rules & {
      secondaryTraitElement: TraitElement
      primaryTraitElement: TraitElement
    })[]
  })[]
}
