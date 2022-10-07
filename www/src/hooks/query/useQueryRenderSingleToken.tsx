import { Collection, TraitElement } from '@prisma/client'
import { createSeed } from '@utils/compiler'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import seedrandom from 'seedrandom'

export const useQueryRenderSingleToken = ({
  tokenId,
  collection,
  layers,
  repositoryId,
}: {
  tokenId: number
  collection: Collection
  repositoryId: string
  layers: LayerElements
}): { traitElements: TraitElement[]; hash: string } => {
  const random = seedrandom(
    createSeed({ repositoryId, collectionName: collection.name, collectionGenerations: collection.generations, tokenId: tokenId })
  )
  const elements: TraitElement[] = []
  layers.forEach(({ traitElements }: { traitElements: TraitElements }, index: number) => {
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

  return {
    traitElements: elements,
    hash: keccak256(
      toUtf8Bytes(
        elements
          .reverse()
          .map((e) => e.id)
          .join('.')
      )
    ),
  }
}
