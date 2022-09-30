import { CloudinaryImage } from '@cloudinary/url-gen'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import seedrandom from 'seedrandom'
import { clientEnv } from 'src/env/schema.mjs'
import { useCloudinaryHelper } from '../utils/useCloudinaryHelper'

export const useQueryRenderSingleToken = ({ id }: { id: number }): { images: CloudinaryImage[] | null; hash: string | null } => {
  const { cld } = useCloudinaryHelper()
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { current: collection } = useQueryRepositoryCollection()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  if (!collection || !layers) return { images: null, hash: null }

  const { id: collectionId, generations } = collection
  const random = seedrandom(`${collectionId}.${generations}.${id}`)
  const elements: TraitElement[] = []
  layers &&
    layers.forEach(
      (
        {
          traitElements,
        }: {
          traitElements: (TraitElement & {
            rulesSecondary: (Rules & {
              secondaryTraitElement: TraitElement & { layerElement: LayerElement }
              primaryTraitElement: TraitElement & { layerElement: LayerElement }
            })[]
            rulesPrimary: (Rules & {
              secondaryTraitElement: TraitElement & { layerElement: LayerElement }
              primaryTraitElement: TraitElement & { layerElement: LayerElement }
            })[]
          })[]
          name: string
        },
        index: number
      ) => {
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
      }
    )

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
