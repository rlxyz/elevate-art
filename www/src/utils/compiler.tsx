import { LayerElement, Rules, TraitElement } from '@prisma/client'
import seedrandom from 'seedrandom'

export const createToken = (opts: {
  id: number
  name: string
  generation: number
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
    })[]
  })[]
}) => {
  const { id, name, generation, layers } = opts

  // const allRules = layers
  //   .map((layer) => layer.traitElements.map((trait) => trait.rulesPrimary))
  //   .flatMap((map) => map)
  //   .filter((arr) => arr.length > 0)
  //   .flatMap((map) => map)

  const random = seedrandom(`${name}.${generation}.${id}`)
  const elements: TraitElement[] = []
  layers.forEach(({ traitElements }, index: number) => {
    // exclusion
    const filtered = traitElements.filter((traitElement) => {
      return (
        traitElement.rulesSecondary.every((rule) => {
          const {
            primaryTraitElement: { layerElement },
            secondaryTraitElement,
          } = rule
          if (
            layerElement.priority > index ||
            traitElements[layerElement.priority]?.name === secondaryTraitElement.name
          )
            return true
          return false
        }) &&
        traitElement.rulesPrimary.every((rule) => {
          const {
            primaryTraitElement,
            secondaryTraitElement: { layerElement },
          } = rule
          if (
            primaryTraitElement.layerElement.priority <= index ||
            traitElements[layerElement.priority]?.name === primaryTraitElement.name
          ) {
            return true
          }
          return false
        })
      )
    })

    let r = Math.floor(random() * filtered.reduce((a, b) => a + b.weight, 0))
    filtered.every((traitElement) => {
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
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
    })[]
  })[],
  totalSupply: number,
  name: string,
  generation: number
): TraitElement[][] => {
  // // sort all layers by priority & trait elements by weight
  // layers
  //   .sort((a, b) => a.priority - b.priority)
  //   .forEach(({ traitElements }: LayerElement & { traitElements: TraitElement[] }) =>
  //     traitElements.sort((a, b) => a.weight - b.weight)
  //   )

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
        ? traitMap.get(l)?.set(t, traitMap.get(l)?.get(t) || 0 + 1)
        : traitMap.get(l)?.set(t, 1)
    })
  })
  return { tokenIdMap, traitMap }
}

export const getTokenRanking = (
  tokens: TraitElement[][],
  traitMap: Map<string, Map<string, number>>,
  totalSupply: number
) => {
  return tokens
    .map((token, index) => {
      return {
        index,
        value: token.reduce((result, item) => {
          const { layerElementId, id } = item
          return result + (traitMap?.get(layerElementId)?.get(id) || 0) / totalSupply
        }, 0),
      }
    })
    .sort((a, b) => {
      return a.value > b.value ? 1 : a.value == b.value ? 0 : -1
    })
    .map((map) => map.index)
}
