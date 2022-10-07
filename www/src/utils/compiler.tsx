import { Collection, TraitElement } from '@prisma/client'
import seedrandom from 'seedrandom'

export const createSeed = ({
  repositoryId,
  collectionName,
  collectionGenerations,
  tokenId,
}: {
  repositoryId: string
  collectionName: string
  collectionGenerations: number
  tokenId: number
}) => {
  return `${repositoryId}.${collectionName}.${collectionGenerations}.${tokenId}`
}

export const renderManyToken = (layers: LayerElements, collection: Collection, repositoryId: string) => {
  return Array.from({ length: collection.totalSupply }, (_, i) => renderSingleToken(layers, collection, i, repositoryId))
}

const renderSingleToken = (layers: LayerElements, collection: Collection, id: number, repositoryId: string) => {
  const random = seedrandom(
    createSeed({ repositoryId, collectionName: collection.name, collectionGenerations: collection.generations, tokenId: id })
  )
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
        openRarityScore: token.reduce((result, item) => {
          const { layerElementId, id } = item
          return result + Math.log((traitMap?.get(layerElementId)?.get(id) || 0) / totalSupply)
        }, 0),
      }
    })
    .sort((a, b) => {
      return a.openRarityScore > b.openRarityScore ? 1 : a.openRarityScore == b.openRarityScore ? 0 : -1
    })
    .map((map) => map.index)
}
