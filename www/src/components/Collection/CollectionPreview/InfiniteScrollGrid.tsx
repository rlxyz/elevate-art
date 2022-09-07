import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createToken } from '@utils/compiler'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'

const InfiniteScrollGridItems = ({
  collection,
  tokensOnDisplay,
  layers,
}: {
  tokensOnDisplay: number[]
  collection: Collection
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
  const { tokens, resetTokens } = useRepositoryStore((state) => {
    return {
      resetTokens: state.resetTokens,
      tokens: state.tokens,
    }
  })

  // todo: this is a hacky way of resetting. fix this.
  useEffect(() => {
    if (!collection) return
    resetTokens(collection.totalSupply)
  }, [collection])

  useEffect(() => {
    console.log('InfiniteScrollGridItems render')
  }, [])

  if (!tokens || !tokens.length || !collection) {
    console.log('InfiniteScrollGridItems null')
    return <></>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6 xl:gap-y-6 xl:gap-x-6 overflow-hidden'>
      {tokensOnDisplay.slice(0, tokens.length).map((index: number) => {
        // console.log('start', index)
        return (
          <CollectionInfiniteScrollItem
            key={`${index}`}
            token={createToken({
              id: Number(tokens[index]),
              name: collection.name,
              generation: collection.generations,
              layers,
            })}
            name={`#${tokens[index] || 0}`}
          />
        )
      })}
    </div>
  )
}

export const InfiniteScrollGrid = ({
  collection,
  layers,
}: {
  collection: Collection
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
  const [tokensOnDisplay, setTokensOnDisplay] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetch = (start: number) => {
    if (!collection) return
    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * 50
    const endPoint = endPointIndex * 50
    setTokensOnDisplay([...tokensOnDisplay, ...[...Array(endPoint - startPoint)].map((_, i) => i + startPoint)])
    setPage((p) => p + 1)
  }

  const fetchMoreData = (page: number) => {
    if (!collection || page * 50 >= collection.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch(page)
  }

  useEffect(() => {
    fetch(page)
  }, [])

  return (
    <InfiniteScrollComponent.default
      dataLength={tokensOnDisplay.length}
      next={() => {
        fetchMoreData(page)
        console.log('InfiniteScrollGrid next')
      }}
      hasMore={hasMore}
      loader={<></>}
    >
      <InfiniteScrollGridItems tokensOnDisplay={tokensOnDisplay} layers={layers} collection={collection} />
    </InfiniteScrollComponent.default>
  )
}
