import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'
import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerElement, Rules, TraitElement } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import seedrandom from 'seedrandom'
import { clientEnv } from 'src/env/schema.mjs'
import { createCloudinary } from './cloudinary'

const useCloudinaryHelper = (): { cld: Cloudinary } => {
  const cld = createCloudinary()
  return { cld }
}

export const useCreateToken = ({ id }: { id: number }): { images: CloudinaryImage[] | null; hash: string | null } => {
  const { cld } = useCloudinaryHelper()
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
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

// export const useCreateManyTokens = (totalSupply: number): TraitElement[][] => {
//   return Array.from(Array(totalSupply).keys()).map((id: number) => {
//     return useCreateToken({ id })
//   })
// }

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
