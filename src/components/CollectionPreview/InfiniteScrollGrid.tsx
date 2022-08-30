import useRepositoryStore from '@hooks/useRepositoryStore'
import { createCollectionSeed, createCompilerApp } from '@utils/createCompilerApp'
import { ethers } from 'ethers'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import CollectionInfiniteScrollItem from './InfiniteScrollGridItem'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { TraitElement } from '@prisma/client'
import Loading from '@components/UI/Loading'
import { createToken } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import Image from 'next/image'

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
  const repository = useRepositoryStore((state) => state.repository)
  const organisation = useRepositoryStore((state) => state.organisation)
  const { collection, tokens, resetTokens, layers, setTokens } = useRepositoryStore((state) => {
    return {
      setTokens: state.setTokens,
      resetTokens: state.resetTokens,
      tokens: state.tokens,
      collection: state.collection,
      layers: state.layers,
    }
  })
  const { data: collectionData } = trpc.useQuery([
    'collection.getCollectionById',
    { id: collection.id },
  ])

  useEffect(() => {
    resetTokens()
  }, [])

  if (!tokens || !tokens.length || !collectionData) return <></>

  return (
    <div className='grid grid-cols-6 gap-y-4 gap-x-10 overflow-hidden'>
      {tokensOnDisplay.map((index: number) => {
        return (
          <CollectionInfiniteScrollItem
            key={`${index}`}
            token={createToken({
              id: Number(tokens[index]),
              name: collection.name,
              generation: collectionData?.generations || 1,
              layers,
            })}
            repositoryName={repository.name}
            organisationName={organisation.name}
            name={`${repository.tokenName} #${tokens[index] || 0}`}
          />
        )
      })}
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
        <div className='grid grid-cols-6 gap-y-4 gap-x-10 overflow-hidden'>
          {Array.from(Array(50).keys()).map((index: number) => {
            return (
              <div>
                <div className='border border-lightGray rounded-[5px]'>
                  <Image
                    width={200}
                    height={200}
                    className='rounded-[5px] border-[1px] border-lightGray'
                    src={`/images/logo.png`}
                  />
                </div>
                <span className='text-xs flex justify-center'>...</span>
              </div>
            )
          })}
        </div>
      }
    >
      <InfiniteScrollGridItems tokensOnDisplay={tokensOnDisplay} />
    </InfiniteScrollComponent.default>
  )
}
