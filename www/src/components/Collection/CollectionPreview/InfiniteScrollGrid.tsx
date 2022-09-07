import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createToken } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import { NextRouter, useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
}

const InfiniteScrollGridItems = ({
  tokensOnDisplay,
  layers,
}: {
  tokensOnDisplay: number[]
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
  const { collectionId, repositoryId, tokens, resetTokens } = useRepositoryStore((state) => {
    return {
      setTokens: state.setTokens,
      resetTokens: state.resetTokens,
      tokens: state.tokens,
      repositoryId: state.repositoryId,
      collectionId: state.collectionId,
    }
  })
  const { data: collection } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const { data: repository } = trpc.useQuery(['repository.getRepositoryById', { id: repositoryId }])

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  useEffect(() => {
    if (!collection) return
    resetTokens(collection.totalSupply)
  }, [collection])

  if (!tokens || !tokens.length || !collection || !repository) return null

  // lags the front end
  const populateCollection = (): ReactNode[] => {
    const items: ReactNode[] = []
    tokensOnDisplay.forEach((index: number) => {
      if (index >= tokens.length) return
      items.push(
        <CollectionInfiniteScrollItem
          key={`${index}`}
          token={createToken({
            id: Number(tokens[index]),
            name: collection.name,
            generation: collection.generations,
            layers,
          })}
          layers={layers}
          repositoryName={repositoryName}
          organisationName={organisationName}
          name={`${repository.tokenName} #${tokens[index] || 0}`}
        />
      )
    })
    return items
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6 xl:gap-y-6 xl:gap-x-6 overflow-hidden'>
      {repository && populateCollection().map((item) => item)}
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
    console.log('fetched next data')
  }

  const fetchMoreData = (page: number) => {
    if (!collection || page * 50 >= collection.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch(page)
  }

  useEffect(() => {
    console.log('populating preview')
    fetch(page)
  }, [])

  return (
    <InfiniteScrollComponent.default
      dataLength={tokensOnDisplay.length}
      next={() => fetchMoreData(page)}
      hasMore={hasMore}
      loader={<></>}
    >
      <InfiniteScrollGridItems tokensOnDisplay={tokensOnDisplay} layers={layers} />
    </InfiniteScrollComponent.default>
  )
}
