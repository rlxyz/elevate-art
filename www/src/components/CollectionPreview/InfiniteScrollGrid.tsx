import useRepositoryStore from '@hooks/useRepositoryStore'
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

const InfiniteScrollGridItems = ({ tokensOnDisplay }: { tokensOnDisplay: number[] }) => {
  const { collection, repository, tokens, resetTokens, layers } = useRepositoryStore((state) => {
    return {
      setTokens: state.setTokens,
      resetTokens: state.resetTokens,
      repository: state.repository,
      tokens: state.tokens,
      collection: state.collection,
      layers: state.layers,
    }
  })
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { data: collectionData } = trpc.useQuery([
    'collection.getCollectionById',
    { id: collection.id },
  ])

  useEffect(() => {
    resetTokens()
  }, [])

  if (!tokens || !tokens.length || !collectionData) return <></>

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
            generation: collectionData.generations,
            layers,
          })}
          repositoryName={repositoryName}
          organisationName={organisationName}
          name={`${repository.tokenName} #${tokens[index] || 0}`}
        />
      )
    })
    return items
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 xl:gap-y-6 xl:gap-x-6 overflow-hidden'>
      {repository && populateCollection().map((item) => item)}
    </div>
  )
}

export const InfiniteScrollGrid = ({ collectionId }: { collectionId: string }) => {
  const { data } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const collection = useRepositoryStore((state) => state.collection)
  const [tokensOnDisplay, setTokensOnDisplay] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetch = (start: number) => {
    if (!collection || !collection.totalSupply) return

    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * 50
    const endPoint = endPointIndex * 50
    setTokensOnDisplay([
      ...tokensOnDisplay,
      ...[...Array(endPoint - startPoint)].map((_, i) => i + startPoint),
    ])
    setPage((p) => p + 1)
  }

  const fetchMoreData = (page: number) => {
    if (!data || page * 50 >= data.totalSupply) {
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
      next={() => fetchMoreData(page)}
      hasMore={hasMore}
      loader={
        // <div className='grid grid-cols-6 gap-y-4 gap-x-10 overflow-hidden'>
        //   {Array.from(Array(50).keys()).map((index: number) => {
        //     return (
        //       <div key={index}>
        //         <div className='border border-lightGray rounded-[5px]'>
        //           <Image
        //             width={200}
        //             height={200}
        //             className='rounded-[5px] border-[1px] border-lightGray'
        //             src={`/images/logo.png`}
        //           />
        //         </div>
        //         <span className='text-xs flex justify-center'>...</span>
        //       </div>
        //     )
        //   })}
        // </div>
        <></>
      }
    >
      <InfiniteScrollGridItems tokensOnDisplay={tokensOnDisplay} />
    </InfiniteScrollComponent.default>
  )
}
