import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'
import { useCurrentCollection } from '@hooks/useCurrentCollection'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import seedrandom from 'seedrandom'
import { clientEnv } from 'src/env/schema.mjs'
import { createCloudinary } from './cloudinary'

const useCloudinaryHelper = (): { cld: Cloudinary } => {
  const cld = createCloudinary()
  return { cld }
}

export const runMany = (
  layers: (LayerElement & {
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
  })[],
  collection: Collection
) => {
  return Array.from({ length: collection.totalSupply }, (_, i) => run(layers, collection, i))
}

const run = (
  layers: (LayerElement & {
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
  })[],
  collection: Collection,
  id: number
) => {
  const { id: collectionId, generations } = collection
  const random = seedrandom(`${collectionId}.${generations}.${id}`)
  const elements: TraitElement[] = []
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
  return elements.reverse()
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

export const useTokens = () => {
  const { tokenRanking, setTraitMapping, rarityFilter, setTokenRanking } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      rarityFilter: state.rarityFilter,
      setTokens: state.setTokens,
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })
  const [hasHydrated, setHasHydrated] = useState(false)

  const { data: layers } = useQueryRepositoryLayer()
  const { collection } = useCurrentCollection()

  useEffect(() => {
    if (hasHydrated) return
    if (!collection || !layers) return
    const tokens = runMany(layers, collection)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
    setTokenRanking(rankings)
    setHasHydrated(true)
    // setTokens(
    //   rankings.slice(
    //     rarityFilter === 'Top 10'
    //       ? 0
    //       : rarityFilter === 'Middle 10'
    //       ? parseInt((rankings.length / 2 - 5).toFixed(0))
    //       : rarityFilter === 'Bottom 10'
    //       ? rankings.length - 10
    //       : 0,
    //     rarityFilter === 'Top 10'
    //       ? 10
    //       : rarityFilter === 'Middle 10'
    //       ? parseInt((rankings.length / 2 + 5).toFixed(0))
    //       : rarityFilter === 'Bottom 10'
    //       ? rankings.length
    //       : rankings.length
    //   )
    // )
  }, [collection?.totalSupply])

  // useEffect(() => {
  //   // batch token creation
  //   if (!collection?.totalSupply) return
  //   if (tokens.length >= collection.totalSupply) return
  //   const timeout = setTimeout(() => {
  //     let next = Number((collection.totalSupply / 10).toFixed(0))
  //     if (next + tokens.length > collection.totalSupply) next = collection.totalSupply - tokens.length
  //     Array.from(Array(next).keys()).forEach((id) => {
  //       setTokens((prev) => [...prev, id])
  //     })
  //   }, 500)

  //   // clean up
  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [tokens.length, collection?.totalSupply])

  useDeepCompareEffect(() => console.log(tokenRanking), [tokenRanking])

  // if (!collection || !layers) return

  // useEffect(() => {
  // if (!collection || !layers) return
  // const tokens = useCreateManyTokens(collection.totalSupply)
  // const { tokenIdMap, traitMap } = getTraitMappings(tokens)
  // setTraitMapping({
  //   tokenIdMap,
  //   traitMap,
  // })
  // const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
  // setTokenRanking(rankings)
  // setTokens(
  //   rankings.slice(
  //     rarityFilter === 'Top 10'
  //       ? 0
  //       : rarityFilter === 'Middle 10'
  //       ? parseInt((rankings.length / 2 - 5).toFixed(0))
  //       : rarityFilter === 'Bottom 10'
  //       ? rankings.length - 10
  //       : 0,
  //     rarityFilter === 'Top 10'
  //       ? 10
  //       : rarityFilter === 'Middle 10'
  //       ? parseInt((rankings.length / 2 + 5).toFixed(0))
  //       : rarityFilter === 'Bottom 10'
  //       ? rankings.length
  //       : rankings.length
  //   )
  // )
  // }, [collection?.generations])
  return { tokens: [] }
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
