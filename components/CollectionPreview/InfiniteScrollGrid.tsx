import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { createCompilerApp } from '@utils/createCompilerApp'
import { App } from '@utils/x/App'
import { ethers } from 'ethers'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
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

const InfiniteScrollGrid = () => {
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(1)
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { collection, repository } = useCompilerViewStore((state) => {
    return {
      collection: state.collection,
      regenerate: state.regenerate,
      repository: state.repository,
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

  const collectionGenerationBatchSize = Number(
    process.env.NEXT_PUBLIC_COLLECTION_GENERATION_BATCH_SIZE || 50
  )

  const app: App = createCompilerApp(repositoryName)

  const fetch = (start: number) => {
    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * collectionGenerationBatchSize
    const endPoint = endPointIndex * collectionGenerationBatchSize

    const { tokens: newTokens } = app.createRandomCollectionFromSeed(
      createCollectionSeed(collection.id, collection.generations),
      startPoint,
      endPoint
    )
    setTokens([...tokens, ...newTokens])
    setPage((p) => p + 1)
  }

  const fetchMoreData = (page: number) => {
    if (page > collection.totalSupply - 1) {
      return
    }

    return fetch(page)
  }

  useEffect(() => {
    fetch(page)
  }, [])

  if (!tokens.length) {
    return <div>loading...</div>
  }

  return (
    <InfiniteScrollComponent.default
      dataLength={tokens.length}
      next={() => fetchMoreData(page)}
      hasMore={true}
      loader={<div className='w-full h-full flex items-center'>...</div>}
    >
      <motion.div
        className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7'
        initial='hidden'
        animate='show'
        variants={container}
      >
        {tokens.map((token, index) => {
          return (
            <CollectionInfiniteScrollItem
              token={token}
              repositoryName={repositoryName}
              organisationName={organisationName}
              name={`${repository.tokenName} #${index}`}
            />
          )
        })}
      </motion.div>
    </InfiniteScrollComponent.default>
  )
}

export default InfiniteScrollGrid
