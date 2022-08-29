import seedrandom from 'seedrandom'
import { LayerElement, TraitElement, Rules } from '@prisma/client'

export const createToken = (opts: {
  id: number
  name: string
  generation: number
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
    })[]
  })[]
}) => {
  const { id, name, generation, layers } = opts
  const random = seedrandom(`${name}.${generation}.${id}`)
  let elements: TraitElement[] = []
  layers.forEach(({ traitElements }) => {
    let r = Math.floor(random() * traitElements.reduce((a, b) => a + b.weight, 0))
    traitElements.every((traitElement) => {
      r -= traitElement.weight
      if (r < 0) {
        elements.push(traitElement)
        return false
      }
      return true
    })
  })
  return elements
}

export const createManyTokens = (
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement
        secondaryTraitElement: TraitElement
      })[]
    })[]
  })[],
  totalSupply: number,
  name: string,
  generation: number
): TraitElement[][] => {
  // sort all layers by priority & trait elements by weight
  layers
    .sort((a, b) => a.priority - b.priority)
    .forEach(({ traitElements }: LayerElement & { traitElements: TraitElement[] }) =>
      traitElements.sort((a, b) => a.weight - b.weight)
    )
  return Array.from(Array(totalSupply).keys()).map((id: number) => {
    return createToken({ id, name, generation, layers })
  })
}

export const getTraitMappings = (allElements: TraitElement[][]) => {
  const tokenIdMap = new Map<string, Map<string, number[]>>()
  const traitMap = new Map<string, Map<string, number>>()

  allElements.forEach((elements: TraitElement[], index: number) => {
    elements.forEach((element: TraitElement) => {
      const { id: t, layerElementId: l } = element

      tokenIdMap.get(l) ||
        (tokenIdMap.set(l, new Map<string, number[]>([])),
        traitMap.set(l, new Map<string, number>()))

      // update tokenIdMap - push to array
      tokenIdMap.get(l)?.get(t)
        ? tokenIdMap.get(l)?.set(t, [...(tokenIdMap.get(l)?.get(t) || []), index])
        : tokenIdMap.get(l)?.set(t, [index])

      // update traitMap - increment by 1 each time
      traitMap.get(l)?.get(t)
        ? traitMap.get(l)?.set(t, traitMap.get(t)?.get(t) || 0 + 1)
        : traitMap.get(l)?.set(t, 1)
    })
  })
  return { tokenIdMap, traitMap }
}
