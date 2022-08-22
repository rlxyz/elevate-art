import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { createCompilerApp } from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { ethers } from 'ethers'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'
import ArtCollection from '@utils/x/Collection'

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
  repositoryName,
  organisationName,
  tokenName,
}: {
  tokens: { attributes: any; token_hash: string }[]
  repositoryName: string
  organisationName: string
  tokenName: string
}) => {
  return (
    <motion.div
      className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7 overflow-hidden'
      initial='hidden'
      animate='show'
      variants={container}
    >
      {tokens.map((token, index) => {
        return (
          <CollectionInfiniteScrollItem
            key={index}
            token={token}
            repositoryName={repositoryName}
            organisationName={organisationName}
            name={`${tokenName} #${index}`}
          />
        )
      })}
    </motion.div>
  )
}

const InfiniteScrollGrid = ({
  tokenName,
  organisationName,
  repositoryName,
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
    // console.log(
    //   artCollection,
    //   startPointIndex,
    //   endPointIndex,
    //   startPointIndex * increments,
    //   endPointIndex * increments
    // )
    // const newTokens = artCollection.filterByPosition(startPoint, endPoint)
    // setTokens([...tokens, ...newTokens])
    setTokens([
      ...tokens,
      ...artCollection.filtered.slice(startPoint, endPoint),
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
        <InfiniteScrollGridItems
          tokens={tokens}
          repositoryName={repositoryName}
          organisationName={organisationName}
          tokenName={tokenName}
        />
      </InfiniteScrollComponent.default>
    )
  )
}

const InfiniteScrollGridSelector = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
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

  const createCollectionSeed = (collectionId: string, generation: number) => {
    return parseInt(
      ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes(`${collectionId}-${generation}`))
        .toString(),
      16
    )
  }

  useEffect(() => {
    const artCollection = new ArtCollection(
      createCompilerApp(repositoryName).createRandomCollectionFromSeed(
        createCollectionSeed(collection.id, Math.random()),
        0,
        5555
      )
    )
    setStartPoint(0)
    // setTotalSupply(collection.totalSupply)
    setTotalSupply(5555)
    setIncrements(50)
    setArtCollection(artCollection)
    setRegenerateCollection(false)
    // }, [regenerate])
  }, [])

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
    totalSupply &&
    !regenerate && (
      // !regenerateFilter &&
      <InfiniteScrollGrid
        repositoryName={repositoryName}
        organisationName={organisationName}
        tokenName={repository.tokenName}
        artCollection={artCollection}
        startPoint={startPoint}
        totalSupply={totalSupply}
        increments={increments}
      />
    )
  )
}

export default InfiniteScrollGridSelector
