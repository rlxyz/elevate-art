import useRepositoryStore from '@hooks/useRepositoryStore'
import {
  createCollectionSeed,
  createCompilerApp,
} from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { ethers } from 'ethers'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'
import { ArtCollectionElement, ArtCollectionToken } from '@utils/x/Collection'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { Player } from '@lottiefiles/react-lottie-player'

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
  tokens,
}: {
  tokens: ArtCollectionToken[]
}) => {
  const repository = useRepositoryStore((state) => state.repository)
  const organisation = useRepositoryStore((state) => state.organisation)
  return (
    <motion.div
      className='grid grid-cols-1 gap-y-4 sm:grid-cols-6 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7 overflow-hidden'
      initial='hidden'
      animate='show'
      variants={container}
    >
      {tokens.map((token: ArtCollectionToken, index) => {
        return (
          <CollectionInfiniteScrollItem
            key={index}
            token={token.attributes}
            repositoryName={repository.name}
            organisationName={organisation.name}
            name={`${repository.tokenName} #${index}`}
          />
        )
      })}
    </motion.div>
  )
}

const InfiniteScrollGrid = ({
  artCollection,
  startPoint,
  totalSupply,
  increments,
}) => {
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(startPoint)
  const [hasMore, setHasMore] = useState(true)

  const fetch = (start: number) => {
    if (!artCollection) return

    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * increments
    const endPoint = endPointIndex * increments
    setTokens([
      ...tokens,
      ...artCollection.getTokens().slice(startPoint, endPoint),
    ])
    setPage((p) => p + 1)
  }

  const fetchMoreData = (page: number) => {
    if (page * increments >= totalSupply) {
      setHasMore(false)
      return
    }
    return fetch(page)
  }

  useEffect(() => {
    fetch(page)
  }, [])

  if (!tokens.length) {
    return (
      <div className='w-full min-h-full flex items-center justify-center'>
        <div className='absolute'>
          <motion.div
            className='box border-[3px] w-5 h-5'
            animate={{
              scale: [1, 1.5, 1.5, 1, 1],
              rotate: [0, 0, 180, 180, 0],
              borderRadius: ['20%', '20%', '50%', '50%', '20%'],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    tokens.length > 0 && (
      <InfiniteScrollComponent.default
        dataLength={tokens.length}
        next={() => fetchMoreData(page)}
        hasMore={hasMore}
        loader={
          <div className='w-full min-h-full flex items-center justify-center'>
            <div className='absolute'>
              <motion.div
                className='box border-[3px] w-5 h-5'
                animate={{
                  scale: [1, 1.5, 1.5, 1, 1],
                  rotate: [0, 0, 180, 180, 0],
                  borderRadius: ['20%', '20%', '50%', '50%', '20%'],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </div>
          </div>
        }
      >
        <InfiniteScrollGridItems tokens={tokens} />
      </InfiniteScrollComponent.default>
    )
  )
}

const InfiniteScrollGridSelector = () => {
  const [startPoint, setStartPoint] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [increments, setIncrements] = useState(50)

  const {
    collection,
    repository,
    regenerate,
    regenerateFilter,
    regenerateFilterIndex,
    setRegenerateFilter,
    setRegenerateCollection,
  } = useRepositoryStore((state) => {
    return {
      artCollection: state.artCollection,
      repository: state.repository,
      collection: state.collection,
      regenerate: state.regenerate,
      regenerateFilter: state.regenerateFilter,
      regenerateFilterIndex: state.regenerateFilterIndex,
      setRegenerateFilter: state.setRegenerateFilter,
      setRegenerateCollection: state.setRegenerateCollection,
      setArtCollection: state.setArtCollection,
    }
  })

  const { setArtCollection, artCollection } = useArtCollectionStore((state) => {
    return {
      artCollection: state.artCollection,
      setArtCollection: state.setArtCollection,
    }
  })

  // useEffect(() => {
  //   const artCollection = new ArtCollection(
  //     createCompilerApp(repositoryName).createRandomCollectionFromSeed(
  //       createCollectionSeed(collection.id, Math.random()),
  //       0,
  //       5555
  //     )
  //   )
  //   setStartPoint(0)
  //   // setTotalSupply(collection.totalSupply)
  //   setTotalSupply(5555)
  //   setIncrements(50)
  //   setArtCollection(artCollection)
  //   setRegenerateCollection(false)
  //   // }, [regenerate])
  // }, [])

  // useEffect(() => {
  //   if (regenerateFilter) {
  //     const artCollection = new ArtCollection(
  //       createCompilerApp(repositoryName).createRandomCollectionFromSeed(
  //         createCollectionSeed(collection.id, collection.generations),
  //         regenerateFilterIndex.start,
  //         regenerateFilterIndex.end
  //       )
  //     )
  //     setStartPoint(0)
  //     setTotalSupply(10)
  //     setIncrements(10)
  //     setArtCollection(artCollection)
  //     setRegenerateFilter(false)
  //   }
  // }, [regenerateFilter])

  return (
    // !regenerateFilter &&
    <InfiniteScrollGrid
      artCollection={artCollection}
      startPoint={startPoint}
      totalSupply={totalSupply}
      increments={increments}
    />
  )
}

export default InfiniteScrollGridSelector
