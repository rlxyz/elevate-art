import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useQueryRepositoryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { useState } from 'react'

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
  const { current: collection } = useQueryRepositoryCollection()

  // useEffect(() => {
  //   if (hasHydrated) return
  //   if (!collection || !layers) return
  //   const tokens = runMany(layers, collection)
  //   const { tokenIdMap, traitMap } = getTraitMappings(tokens)
  //   setTraitMapping({
  //     tokenIdMap,
  //     traitMap,
  //   })
  //   const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
  //   setTokenRanking(rankings)
  //   setHasHydrated(true)
  //   // setTokens(
  //   //   rankings.slice(
  //   //     rarityFilter === 'Top 10'
  //   //       ? 0
  //   //       : rarityFilter === 'Middle 10'
  //   //       ? parseInt((rankings.length / 2 - 5).toFixed(0))
  //   //       : rarityFilter === 'Bottom 10'
  //   //       ? rankings.length - 10
  //   //       : 0,
  //   //     rarityFilter === 'Top 10'
  //   //       ? 10
  //   //       : rarityFilter === 'Middle 10'
  //   //       ? parseInt((rankings.length / 2 + 5).toFixed(0))
  //   //       : rarityFilter === 'Bottom 10'
  //   //       ? rankings.length
  //   //       : rankings.length
  //   //   )
  //   // )
  // }, [collection?.totalSupply])

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
