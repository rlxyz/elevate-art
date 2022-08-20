import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { useNotification } from '@hooks/useNotification'
import { createCompilerApp } from '@utils/createCompilerApp'
import { fetcher, fetcherPost } from '@utils/fetcher'
import { toPascalCaseWithSpace } from '@utils/format'
import { App } from '@utils/x/App'
import Collection from '@utils/x/Collection'
import { ethers } from 'ethers'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { CollectionViewContent } from './ViewContent'

const createCollectionSeed = (collectionId: string, generation: number) => {
  return parseInt(
    ethers.utils
      .keccak256(ethers.utils.toUtf8Bytes(`${collectionId}-${generation}`))
      .toString(),
    16
  )
}

const COLLECTION_GENERATION_SIZE = Number(
  process.env.NEXT_PUBLIC_COLLECTION_GENERATION_SIZE || 50
)

const COLLECTION_GENERATION_MAX_SIZE_PER_PAGE = Number(
  process.env.NEXT_PUBLIC_COLLECTION_GENERATION_MAX_SIZE_PER_PAGE || 200
)

const CollectionInfiniteScroll = () => {
  const [tokens, setTokens] = useState([])
  const [nextStartPoint, setNextStartPoint] = useState(0)
  const [fetching, setFetching] = useState(true)

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { collection, repository, artCollection, setArtCollection } =
    useCompilerViewStore((state) => {
      return {
        collection: state.collection,
        regenerate: state.regenerate,
        repository: state.repository,
        artCollection: state.artCollection,
        setArtCollection: state.setArtCollection,
      }
    })

  const app: App = createCompilerApp(repositoryName)

  const fetchItems = useCallback(() => {
    if (!fetching) {
      return
    }

    const startPointIndex = nextStartPoint
    const endPointIndex = nextStartPoint + 1
    const startPoint = startPointIndex * COLLECTION_GENERATION_SIZE
    const endPoint = endPointIndex * COLLECTION_GENERATION_SIZE

    const { tokens: newTokens } = app.createRandomCollectionFromSeed(
      createCollectionSeed(collection.id, collection.generations),
      startPoint,
      endPoint
    )

    setTokens([...tokens, ...newTokens])
    setNextStartPoint(endPointIndex)

    if (endPoint > COLLECTION_GENERATION_MAX_SIZE_PER_PAGE - 1) {
      setFetching(false)
    }
  }, [tokens, fetching, nextStartPoint, collection])

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7'>
      {tokens.map((token, index) => {
        return (
          <div className='flex flex-col' key={index}>
            <div
              className='h-[120px] overflow-hidden'
              style={{ transformStyle: 'preserve-3d' }}
            >
              {token.attributes.map((attribute, index) => {
                return (
                  <div
                    className='absolute w-full h-full flex flex-col items-center'
                    key={index}
                  >
                    <img
                      className='rounded-[5px] border-[1px] border-lightGray'
                      src={`${
                        process.env.NEXT_PUBLIC_CLOUDINARY_URL
                      }/image/upload/${
                        process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES
                          ? 'c_fill,h_200,w_200'
                          : ''
                      }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                        attribute['trait_type']
                      )}/${toPascalCaseWithSpace(attribute['value'])}.png`}
                    />
                  </div>
                )
              })}
            </div>
            <span className='text-xs'>{`${repository.tokenName} #${index}`}</span>
          </div>
        )
      })}
    </div>
  )
}

const CollectionGenerateView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionTotalSupply = 100
  const {
    collection,
    regenerate,
    repository,
    artCollection,
    setArtCollection,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
    return {
      collection: state.collection,
      regenerate: state.regenerate,
      repository: state.repository,
      artCollection: state.artCollection,
      setArtCollection: state.setArtCollection,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })
  const { notifySuccess } = useNotification(repositoryName)

  // const handler = async (regenerate: boolean) => {
  //   const app: App = createCompilerApp(repositoryName)
  //   const _collection: Collection = await app.createRandomCollectionFromSeed(
  //     collectionTotalSupply,
  //     parseInt(
  //       ethers.utils
  //         .keccak256(
  //           ethers.utils.toUtf8Bytes(
  //             `${collection.id}-${collection.generations + 1}`
  //           )
  //         )
  //         .toString(),
  //       16
  //     )
  //   )
  //   console.log('_collection', collection.generations + 1)
  //   setArtCollection(_collection)
  // }

  // useEffect(() => {
  //   if (regenerate) {
  //     notifySuccess()
  //     console.log('start')
  //     handler(true).then(async () => {
  //       console.log('done')
  //       setRegenerateCollection(false)
  //       regenerate
  //         ? await fetcherPost(`collection/${collection.id}/generate`, {})
  //         : await fetcher(`collection/${collection.id}/generate`)
  //     })
  //   }
  // }, [regenerate])

  // useEffect(() => {
  //   handler(false)
  // }, [])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <div className='p-8'>
        <CollectionInfiniteScroll />
      </div>
    </CollectionViewContent>
  )
}

export default CollectionGenerateView
