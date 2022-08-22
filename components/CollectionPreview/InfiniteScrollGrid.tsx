import useCompilerViewStore from '@hooks/useCompilerViewStore'
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
  const repository = useCompilerViewStore((state) => state.repository)
  const organisation = useCompilerViewStore((state) => state.organisation)

  console.log({ organisation, repository })

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
    if (page * increments >= totalSupply) return
    return fetch(page)
  }

  useEffect(() => {
    fetch(page)
  }, [])

  if (!tokens.length) {
    return <div>loading...</div>
  }

  return (
    tokens.length > 0 && (
      <InfiniteScrollComponent.default
        dataLength={tokens.length}
        next={() => fetchMoreData(page)}
        hasMore={true}
        loader={<div className='w-full h-full flex items-center'>...</div>}
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
    artCollection,
    collection,
    repository,
    regenerate,
    regenerateFilter,
    regenerateFilterIndex,
    setArtCollection,
    setRegenerateFilter,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
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
