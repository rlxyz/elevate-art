import { Collection, TraitElement } from '@prisma/client'
import seedrandom from 'seedrandom'

export const renderManyToken = (layers: LayerElements, collection: Collection) => {
  return Array.from({ length: collection.totalSupply }, (_, i) => renderSingleToken(layers, collection, i))
}

const renderSingleToken = (layers: LayerElements, collection: Collection, id: number) => {
  const { id: collectionId, generations } = collection
  const random = seedrandom(`${collectionId}.${generations}.${id}`)
  const elements: TraitElement[] = []
  layers.forEach(({ traitElements }: { traitElements: TraitElements; name: string }, index: number) => {
    // exclusion
    const filtered = traitElements.filter((traitElement) => {
      const rules = [...(traitElement.rulesPrimary || []), ...(traitElement.rulesSecondary || [])].filter((rule) => {
        if (rule.primaryTraitElementId === traitElement.id) return index > rule.secondaryTraitElement.layerElement.priority
        if (rule.secondaryTraitElementId === traitElement.id) return index > rule.primaryTraitElement.layerElement.priority
      })
      return rules.every((rule) => {
        if (rule.primaryTraitElementId === traitElement.id) {
          return elements[rule.secondaryTraitElement.layerElement.priority]?.id !== rule.secondaryTraitElementId
        }
        if (rule.secondaryTraitElementId === traitElement.id) {
          return elements[rule.primaryTraitElement.layerElement.priority]?.id !== rule.primaryTraitElementId
        }
      })
    })
    let r = random() * filtered.reduce((a, b) => a + b.weight, 0)
    filtered.every((traitElement) => {
      r -= traitElement.weight
      if (r < 0) {
        elements.push(traitElement)
        return false
      }
      return true
    })
  })
  return elements.reverse()
}

export const getTraitMappings = (allElements: TraitElement[][]) => {
  const tokenIdMap = new Map<string, Map<string, number[]>>()
  const traitMap = new Map<string, Map<string, number>>()

  allElements.forEach((elements: TraitElement[], index: number) => {
    elements.forEach((element: TraitElement) => {
      const { id: t, layerElementId: l } = element

      tokenIdMap.get(l) || (tokenIdMap.set(l, new Map<string, number[]>([])), traitMap.set(l, new Map<string, number>()))

      // update tokenIdMap - push to array
      tokenIdMap.get(l)?.get(t)
        ? tokenIdMap.get(l)?.set(t, [...(tokenIdMap.get(l)?.get(t) || []), index])
        : tokenIdMap.get(l)?.set(t, [index])

      // update traitMap - increment by 1 each time
      traitMap.get(l)?.get(t) ? traitMap.get(l)?.set(t, (traitMap.get(l)?.get(t) || 1) + 1) : traitMap.get(l)?.set(t, 1)
    })
  })
  return { tokenIdMap, traitMap }
}

export const getTokenRanking = (tokens: TraitElement[][], traitMap: Map<string, Map<string, number>>, totalSupply: number) => {
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
