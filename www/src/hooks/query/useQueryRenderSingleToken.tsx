import { CloudinaryImage } from '@cloudinary/url-gen'
import { useCloudinaryHelper } from '@hooks/utils/useCloudinaryHelper'
import { Collection, TraitElement } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import seedrandom from 'seedrandom'
import { clientEnv } from 'src/env/schema.mjs'

export const useQueryRenderSingleToken = ({
  id,
  collection,
  layers,
  repositoryId,
}: {
  id: number
  collection: Collection
  repositoryId: string
  layers: LayerElements
}): { images: CloudinaryImage[] | null; hash: string | null } => {
  const { id: collectionId, generations } = collection
  const { cld } = useCloudinaryHelper()
  const random = seedrandom(`${collectionId}.${generations}.${id}`)
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
    images: elements.reverse().map(
      (e) => cld.image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${e.layerElementId}/${e.id}.png`).format('png')
      // .delivery(Delivery.quality('auto:low'))
    ),
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
