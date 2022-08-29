import useRepositoryStore from '@hooks/useRepositoryStore'
import { createCollectionSeed, createCompilerApp } from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { ethers } from 'ethers'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'
import { ArtCollectionElement, ArtCollectionToken } from '@utils/x/Collection'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { TraitElement } from '@prisma/client'
import Loading from '@components/UI/Loading'
import { createToken } from '@utils/compiler'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
}

const InfiniteScrollGridItems = ({ tokens }: { tokens: number[] }) => {
  const repository = useRepositoryStore((state) => state.repository)
  const organisation = useRepositoryStore((state) => state.organisation)
  const { collection, layers } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      layers: state.layers,
    }
  })
  return (
    <motion.div
      className='grid grid-cols-1 gap-y-4 sm:grid-cols-6 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7 overflow-hidden'
      initial='hidden'
      animate='show'
      variants={container}
    >
      {tokens.map((token: number) => {
        return (
          <CollectionInfiniteScrollItem
            key={token}
            token={createToken({
              id: token,
              name: collection.name,
              generation: collection.generations,
              layers,
            })}
            repositoryName={repository.name}
            organisationName={organisation.name}
            name={`${repository.tokenName} #${token}`}
          />
        )
      })}
    </motion.div>
  )
}

export const InfiniteScrollGrid = ({ tokens }: { tokens: TraitElement[][] }) => {
  const [tokensOnDisplay, setTokensOnDisplay] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Reset
  useEffect(() => {
    setTokensOnDisplay([])
    setPage(0)
    setHasMore(true)
    setHasHydrated(false)
  }, [tokens])

  const fetch = (start: number) => {
    if (!tokens || !tokens.length) return

    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * 50
    const endPoint = endPointIndex * 50
    setTokensOnDisplay([
      ...tokensOnDisplay,
      ...[...Array(endPoint - startPoint)].map((_, i) => i + startPoint),
    ])
    setPage((p) => p + 1)
    setHasHydrated(true)
  }

  const fetchMoreData = (page: number) => {
    if (page * 50 >= tokens.length) {
      setHasMore(false)
      return
    }
    return fetch(page)
  }

  useEffect(() => {
    !hasHydrated && fetch(page), setHasHydrated(true)
  }, [hasHydrated])

  if (!tokensOnDisplay.length || !hasHydrated) {
    return <Loading />
  }

  return (
    <InfiniteScrollComponent.default
      dataLength={tokensOnDisplay.length}
      next={() => fetchMoreData(page)}
      hasMore={hasMore}
      loader={<Loading />}
    >
      <InfiniteScrollGridItems tokens={tokensOnDisplay} />
    </InfiniteScrollComponent.default>
  )
}

// const InfiniteScrollGridSelector = ({ artCollection }: TraitElement[][]) => {
//   const [startPoint, setStartPoint] = useState(null)
//   const [totalSupply, setTotalSupply] = useState(null)
//   const [increments, setIncrements] = useState(50)

//   const {
//     collection,
//     repository,
//     regenerate,
//     regenerateFilter,
//     regenerateFilterIndex,
//     setRegenerateFilter,
//     setRegenerateCollection,
//   } = useRepositoryStore((state) => {
//     return {
//       repository: state.repository,
//       collection: state.collection,
//       regenerate: state.regenerate,
//       regenerateFilter: state.regenerateFilter,
//       regenerateFilterIndex: state.regenerateFilterIndex,
//       setRegenerateFilter: state.setRegenerateFilter,
//       setRegenerateCollection: state.setRegenerateCollection,
//     }
//   })

//   const { setArtCollection, artCollection } = useArtCollectionStore((state) => {
//     return {
//       artCollection: state.artCollection,
//       setArtCollection: state.setArtCollection,
//     }
//   })

//   // useEffect(() => {
//   //   const artCollection = new ArtCollection(
//   //     createCompilerApp(repositoryName).createRandomCollectionFromSeed(
//   //       createCollectionSeed(collection.id, Math.random()),
//   //       0,
//   //       5555
//   //     )
//   //   )
//   //   setStartPoint(0)
//   //   // setTotalSupply(collection.totalSupply)
//   //   setTotalSupply(5555)
//   //   setIncrements(50)
//   //   setArtCollection(artCollection)
//   //   setRegenerateCollection(false)
//   //   // }, [regenerate])
//   // }, [])

//   // useEffect(() => {
//   //   if (regenerateFilter) {
//   //     const artCollection = new ArtCollection(
//   //       createCompilerApp(repositoryName).createRandomCollectionFromSeed(
//   //         createCollectionSeed(collection.id, collection.generations),
//   //         regenerateFilterIndex.start,
//   //         regenerateFilterIndex.end
//   //       )
//   //     )
//   //     setStartPoint(0)
//   //     setTotalSupply(10)
//   //     setIncrements(10)
//   //     setArtCollection(artCollection)
//   //     setRegenerateFilter(false)
//   //   }
//   // }, [regenerateFilter])

//   return (
//     // !regenerateFilter &&
//     <div>Hi</div>
//   )
// }

// export default InfiniteScrollGridSelector
